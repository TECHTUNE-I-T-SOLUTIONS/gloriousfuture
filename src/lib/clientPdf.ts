/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

// avoid importing 'jspdf' at module scope; use a local alias so bundlers don't pull in jspdf/canvg/core-js

type JsPDFClass = any

type ChangedEntry = [HTMLElement, string | null]

export function normalizeElementColors(root: HTMLElement): ChangedEntry[] {
  const props = ['color', 'background-color', 'border-color']
  const walker = root.querySelectorAll('*')
  const changed: ChangedEntry[] = []
  walker.forEach((el) => {
    try {
      const cs = window.getComputedStyle(el as HTMLElement)
      let modified = false
      const prev = (el as HTMLElement).getAttribute('style')
      const styleParts: string[] = []
      for (const p of props) {
        try {
          const val = cs.getPropertyValue(p)
          if (val && val !== 'transparent' && val !== 'initial') {
            const resolved = ((): string | null => {
              try {
                const span = document.createElement('span')
                span.style.color = val
                span.style.display = 'none'
                document.body.appendChild(span)
                const resolved = window.getComputedStyle(span).color
                span.remove()
                return resolved
              } catch {
                return null
              }
            })()
            if (resolved && resolved !== val) {
              styleParts.push(`${p}: ${resolved}`)
              modified = true
            }
          }
        } catch {}
      }
      try {
        const box = cs.getPropertyValue('box-shadow')
        if (box && box !== 'none') styleParts.push('box-shadow: none')
      } catch {}

      if (modified) {
        const newStyle = styleParts.length ? `${prev || ''};${styleParts.join(';')}` : prev
        if (newStyle) (el as HTMLElement).setAttribute('style', newStyle)
        changed.push([el as HTMLElement, prev])
      }
    } catch {
      // ignore
    }
  })
  return changed
}

function sanitizeColorString(val: unknown): unknown {
  try {
    if (typeof val !== 'string') return val
    // quick check for modern color functions we don't want to reach the canvas parser
    if (!/\b(oklch|lch|lab|color)\(/i.test(val)) return val
    const span = document.createElement('span')
    span.style.color = val
    span.style.display = 'none'
    document.body.appendChild(span)
    const resolved = window.getComputedStyle(span).color
    span.remove()
    return resolved || val
  } catch {
    return val
  }
}

export function installCanvasColorSanitizer() {
  const ctxProto: any = (window as any).CanvasRenderingContext2D?.prototype
  const gradProto: any = (window as any).CanvasGradient?.prototype
  const originals: Record<string, any> = {}

  try {
    if (ctxProto) {
      ;['fillStyle', 'strokeStyle', 'shadowColor'].forEach((prop) => {
        const desc = Object.getOwnPropertyDescriptor(ctxProto, prop)
        if (!desc) return
        originals[prop] = desc
        Object.defineProperty(ctxProto, prop, {
          get: function () { return desc.get?.call(this) },
          set: function (v: any) { return desc.set?.call(this, sanitizeColorString(v)) },
          configurable: true,
          enumerable: true,
        })
      })
    }

    if (gradProto && gradProto.addColorStop) {
      originals.addColorStop = gradProto.addColorStop
      gradProto.addColorStop = function (offset: number, color: string) {
        return originals.addColorStop.call(this, offset, sanitizeColorString(color))
      }
    }
  } catch (e) {
    // ignore; best-effort shim
    console.debug('canvas color sanitizer install failed', e)
  }

  return function uninstall() {
    try {
      if (ctxProto) {
        ;['fillStyle', 'strokeStyle', 'shadowColor'].forEach((prop) => {
          const orig = originals[prop]
          if (orig) Object.defineProperty(ctxProto, prop, orig)
        })
      }
      if (gradProto && originals.addColorStop) gradProto.addColorStop = originals.addColorStop
    } catch (err) {
      console.debug('canvas color sanitizer uninstall failed', err)
    }
  }
}

function createSanitizedStylesheet() {
  const regex = /\b(?:oklch|lch|lab|color)\([^)]*\)/gi
  type SanitizedEntry = { href?: string | null, selector: string, property: string, original: string, replaced: string }
  const report: SanitizedEntry[] = []
  let cssText = ''
  const styleSheets = Array.from(document.styleSheets)
  for (const sheet of styleSheets) {
    let rules: CSSRuleList | null = null
    try {
      rules = (sheet as CSSStyleSheet).cssRules
    } catch {
      // cross-origin or inaccessible stylesheet; skip
      continue
    }
    if (!rules) continue

    for (const r of Array.from(rules)) {
      try {
        if (r.type === CSSRule.STYLE_RULE) {
          const sr = r as CSSStyleRule
          const selector = sr.selectorText
          const style = sr.style
          const props: string[] = []
          for (let i = 0; i < style.length; i++) {
            const name = style.item(i)
            const val = style.getPropertyValue(name)
            if (regex.test(val)) {
              // replace all color function occurrences with computed rgb equivalents
              const replaced = val.replace(regex, (m) => {
                const resolved = sanitizeColorString(m)
                return typeof resolved === 'string' ? resolved : m
              })
              props.push(`${name}: ${replaced}`)
              report.push({ href: (sheet as CSSStyleSheet).href || null, selector, property: name, original: val, replaced })
            }
          }
          if (props.length) cssText += `${selector}{${props.join(';')}}\n`
        } else if (r.type === CSSRule.MEDIA_RULE) {
          const mr = r as CSSMediaRule
          let inner = ''
        for (const ir of Array.from(mr.cssRules)) {
            if (ir.type === CSSRule.STYLE_RULE) {
              const sr = ir as CSSStyleRule
              const selector = sr.selectorText
              const style = sr.style
              const props: string[] = []
              for (let i = 0; i < style.length; i++) {
                const name = style.item(i)
                const val = style.getPropertyValue(name)
                if (regex.test(val)) {
                  const replaced = val.replace(regex, (m) => {
                    const resolved = sanitizeColorString(m)
                    return typeof resolved === 'string' ? resolved : m
                  })
          props.push(`${name}: ${replaced}`)
          report.push({ href: (sheet as CSSStyleSheet).href || null, selector, property: name, original: val, replaced })
                }
              }
              if (props.length) inner += `${selector}{${props.join(';')}}\n`
            }
          }
          if (inner) cssText += `@media ${mr.media.mediaText}{${inner}}\n`
        }
      } catch {
        // ignore individual rule failures
      }
    }
  }

  if (!cssText) return () => {}
  const el = document.createElement('style')
  el.setAttribute('data-sanitized-colors', '1')
  el.textContent = cssText
  try { el.dataset['sanitizedReport'] = JSON.stringify(report) } catch {}
  document.head.appendChild(el)

  return function remove() {
    try { el.remove() } catch { /* ignore */ }
  }
}


export function getLastSanitizedStylesheetReport(): Array<{ href?: string | null, selector: string, property: string, original: string, replaced: string }> {
  // Attempt to find the last created style element and return its attached report if present.
  try {
    const el = document.querySelector('style[data-sanitized-colors]') as HTMLStyleElement | null
    if (!el) return []
    // The remove function was returned earlier; we can't access its closure here, so we rely on a heuristic:
    // Walk document.head for the style element's text and re-run a quick scan to report replacements.
    try {
      const asJson = el.dataset['sanitizedReport']
      if (asJson) return JSON.parse(asJson)
    } catch {}
    const text = el.textContent || ''
    const out: Array<{ href?: string | null, selector: string, property: string, original: string, replaced: string }> = []
    // Parse simple rules of form selector{prop: value}
    const ruleRegex = /([^{}]+)\{([^}]+)\}/g
    let m
    while ((m = ruleRegex.exec(text)) !== null) {
      const selector = m[1].trim()
      const body = m[2]
      const parts = body.split(';').map((s) => s.trim()).filter(Boolean)
      for (const p of parts) {
        const idx = p.indexOf(':')
        if (idx > 0) {
          const name = p.slice(0, idx).trim()
          const val = p.slice(idx + 1).trim()
          out.push({ href: null, selector, property: name, original: '', replaced: val })
        }
      }
    }
    return out
  } catch {
    return []
  }
}

function sanitizeElementSubtree(root: HTMLElement) {
  const regex = /\b(?:oklch|lch|lab|color)\([^)]*\)/gi
  const propsToCheck = [
    'color',
    'background',
    'background-color',
    'background-image',
    'box-shadow',
    'border-color',
    'outline-color',
    'text-decoration-color',
    'fill',
    'stroke',
  ]

  const changed: Array<[HTMLElement, string | null]> = []
  const pseudoRules: string[] = []
  let idCounter = 0

  const els = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[]
  els.forEach((el) => {
    try {
      const cs = window.getComputedStyle(el)
      const prev = el.getAttribute('style')
      const parts: string[] = []
      let modified = false

      for (const prop of propsToCheck) {
        try {
          const val = cs.getPropertyValue(prop)
          if (val && regex.test(val)) {
            // replace any color() functions inside the value
            const replaced = val.replace(regex, (m) => {
              const resolved = sanitizeColorString(m)
              return typeof resolved === 'string' ? resolved : m
            })
            parts.push(`${prop}: ${replaced}`)
            modified = true
          }
        } catch {}
      }

      // handle pseudo-elements ::before and ::after
      ;['::before', '::after'].forEach((p) => {
        try {
          const pcs = window.getComputedStyle(el, p)
          const pseudoParts: string[] = []
          let pseudoModified = false
          for (const prop of propsToCheck) {
            try {
              const val = pcs.getPropertyValue(prop)
              if (val && regex.test(val)) {
                const replaced = val.replace(regex, (m) => {
                  const resolved = sanitizeColorString(m)
                  return typeof resolved === 'string' ? resolved : m
                })
                pseudoParts.push(`${prop}: ${replaced}`)
                pseudoModified = true
              }
            } catch {}
          }
          if (pseudoModified) {
            const id = `data-pdf-sanitize-${++idCounter}`
            el.setAttribute(id, '1')
            // create a selector that matches this exact element using the attribute
            pseudoRules.push(`[${id}]${p}{${pseudoParts.join(';')}}`)
          }
        } catch {}
      })

      if (modified) {
        const newStyle = `${prev || ''};${parts.join(';')}`
        if (newStyle) el.setAttribute('style', newStyle)
        changed.push([el, prev])
      }
    } catch {
      // ignore
    }
  })

  let styleEl: HTMLStyleElement | null = null
  if (pseudoRules.length) {
    styleEl = document.createElement('style')
    styleEl.setAttribute('data-pdf-pseudo-sanitize', '1')
    styleEl.textContent = pseudoRules.join('\n')
    document.head.appendChild(styleEl)
  }

  return function restore() {
    // restore inline styles
    changed.forEach(([node, prev]) => {
      try {
        if (prev == null) node.removeAttribute('style')
        else node.setAttribute('style', prev)
      } catch {}
    })
    // remove pseudo style and attributes
    if (styleEl) try { styleEl.remove() } catch {}
    for (let i = 1; i <= idCounter; i++) {
      const attr = `data-pdf-sanitize-${i}`
      const sel = `[${attr}]`
      const node = document.querySelector(sel) as HTMLElement | null
      if (node) node.removeAttribute(attr)
    }
  }
}

function createCssVariableOverrides() {
  const regex = /\b(?:oklch|lch|lab|color)\([^)]*\)/gi
  let cssText = ''
  const styleSheets = Array.from(document.styleSheets)
  for (const sheet of styleSheets) {
    let rules: CSSRuleList | null = null
    try { rules = (sheet as CSSStyleSheet).cssRules } catch { continue }
    if (!rules) continue
    for (const r of Array.from(rules)) {
      try {
        if (r.type === CSSRule.STYLE_RULE) {
          const sr = r as CSSStyleRule
          const selector = sr.selectorText
          const style = sr.style
          const parts: string[] = []
          for (let i = 0; i < style.length; i++) {
            const name = style.item(i)
            if (!name || !name.startsWith('--')) continue
            const val = style.getPropertyValue(name)
            if (regex.test(val)) {
              const replaced = val.replace(regex, (m) => {
                const resolved = sanitizeColorString(m)
                return typeof resolved === 'string' ? resolved : m
              })
              parts.push(`${name}: ${replaced}`)
            }
          }
          if (parts.length) cssText += `${selector}{${parts.join(';')}}\n`
        }
      } catch {}
    }
  }
  if (!cssText) return () => {}
  const el = document.createElement('style')
  el.setAttribute('data-pdf-css-var-overrides', '1')
  el.textContent = cssText
  document.head.appendChild(el)
  return function remove() { try { el.remove() } catch {} }
}

async function captureElementByCloningAndPrint(elementId: string) {
  const root = document.getElementById(elementId)
  if (!root) throw new Error(`Element with id "${elementId}" not found`)

  // deep clone the node
  const clone = root.cloneNode(true) as HTMLElement

  // inline computed styles for the cloned subtree
  const walk = [clone, ...Array.from(clone.querySelectorAll('*'))] as HTMLElement[]
  walk.forEach((node) => {
    try {
      const cs = window.getComputedStyle(findOriginal(node, root, clone) || node)
      const styleText: string[] = []
      for (let i = 0; i < cs.length; i++) {
        const name = cs.item(i)
        try {
          const val = cs.getPropertyValue(name)
          if (val && val !== 'initial') styleText.push(`${name}:${val}`)
        } catch {}
      }
      if (styleText.length) node.setAttribute('style', styleText.join(';'))
    } catch {}
  })

  // collect pseudo-element rules for originals and apply to clone via attribute mapping
  const pseudoRules: string[] = []
  let idCounter = 0
  const originals = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[]
  originals.forEach((orig) => {
    ;['::before', '::after'].forEach((p) => {
      try {
        const pcs = window.getComputedStyle(orig, p)
        const props: string[] = []
        for (const name of ['content','color','background','background-color','box-shadow','border-color']) {
          try {
            const v = pcs.getPropertyValue(name)
            if (v && v !== 'none' && v !== 'normal') props.push(`${name}:${v}`)
          } catch {}
        }
        if (props.length) {
          const id = `data-print-sanitize-${++idCounter}`
          // find corresponding cloned node and mark it
          const idx = originals.indexOf(orig)
          const clonedNode = walk[idx]
          if (clonedNode) clonedNode.setAttribute(id, '1')
          pseudoRules.push(`[${id}]${p}{${props.join(';')}}`)
        }
      } catch {}
    })
  })

  const doc = window.open('', '_blank')
  if (!doc) throw new Error('Unable to open print window')
  const headParts: string[] = []
  headParts.push('<meta charset="utf-8">')
  // copy over document stylesheets links to preserve fonts and base CSS (safe; cross-origin links will remain as links)
  Array.from(document.querySelectorAll('link[rel=stylesheet]')).forEach((ln) => headParts.push(ln.outerHTML))

  // print-specific styles to make the exported page look polished
  const printStyles = `
    @page { size: A4; margin: 18mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #111827; background: #ffffff; margin:0; padding:0 }
    .print-wrapper { width: 100%; max-width: 210mm; margin: 0 auto; padding: 6mm; box-sizing: border-box }
    .print-header { display:flex; align-items:center; gap:12px; padding:6px 0 10px 0; border-bottom:1px solid #e5e7eb }
    .print-logo { height:40px; width:auto }
    .print-title { font-weight:700; font-size:18px; color:#0f172a }
    .print-meta { margin-left:auto; color:#6b7280; font-size:12px }
    .print-content { padding-top:12px }
    /* ensure images scale */
    .print-content img { max-width:100%; height:auto }
    /* hide interactive elements */
    .no-print, button, a[data-no-print] { display:none !important }
  .watermark{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); opacity:0.08; font-weight:700; color: rgba(15,23,42,0.08); pointer-events:none }
  .pdf-page { background: #fff }
    @media print { .print-wrapper { box-shadow: none } }
  `

  // add pseudo-element rules
  if (pseudoRules.length) headParts.push(`<style>${pseudoRules.join('\n')}</style>`)
  headParts.push(`<style>${printStyles}</style>`)

  doc.document.open()
  doc.document.write(`<!doctype html><html><head>${headParts.join('\n')}</head><body></body></html>`)
  doc.document.close()

  // determine metadata: title, school, owner
  // Only use an explicit print/title attribute — do not default to document.title to avoid duplicate headers
  const metaTitle = root.getAttribute('data-print-title') || root.getAttribute('data-title') || ''
  const owner = root.getAttribute('data-for') || root.getAttribute('data-owner') || root.getAttribute('data-user') || ''
  const school = root.getAttribute('data-school') || document.querySelector('meta[name="school"]')?.getAttribute('content') || ''

  // build a clean wrapper - we'll paginate into multiple .pdf-page elements
  const wrapper = doc.document.createElement('div')
  wrapper.className = 'print-wrapper'

  // convert mm to px (approx at 96dpi)
  const pxPerMm = 96 / 25.4
  const pageMarginMm = 18 // same as CSS @page margin
  const pageWidthMm = 210 - pageMarginMm * 2
  const pageHeightMm = 297 - pageMarginMm * 2
  const pageWidthPx = Math.floor(pageWidthMm * pxPerMm)
  const pageInnerHeightPx = Math.floor(pageHeightMm * pxPerMm)

  // prepare watermark and header/footer templates
  const watermarkHtml = `<div class="watermark">${school ? school : ''}</div>`

  // measure clone dimensions (attached off-DOM to measure) - attach invisibly
  const measurer = doc.document.createElement('div')
  measurer.style.position = 'absolute'
  measurer.style.visibility = 'hidden'
  measurer.style.left = '-9999px'
  // only create a temp header if we have an explicit title/owner/school to show
  let tempHeader: HTMLDivElement | null = null
  if (metaTitle || owner || school) {
    tempHeader = doc.document.createElement('div')
    tempHeader.className = 'print-header'
    tempHeader.style.display = 'flex'
    tempHeader.style.position = 'relative'
    tempHeader.innerHTML = `<img src="/logo.png" class="print-logo" style="height:36px" alt="logo"/><div class="print-title">${metaTitle}</div><div class="print-meta">${new Date().toLocaleString()}</div>`
  }
  const tempFooter = doc.document.createElement('div')
  tempFooter.className = 'page-footer'
  tempFooter.style.fontSize = '11px'
  tempFooter.style.color = '#6b7280'
  tempFooter.innerHTML = `${school || ''} <span>Page</span>`

  if (tempHeader) measurer.appendChild(tempHeader)
  measurer.appendChild(clone)
  measurer.appendChild(tempFooter)
  doc.document.body.appendChild(measurer)

  // compute scaling to fit page width
  // measure header/footer heights from the temp elements
  const headerHeightPx = tempHeader ? Math.max(0, tempHeader.getBoundingClientRect().height || 0) : 0
  const footerHeightPx = Math.max(0, tempFooter.getBoundingClientRect().height || 0)
  const availableContentHeightPx = Math.max(24, pageInnerHeightPx - Math.ceil(headerHeightPx) - Math.ceil(footerHeightPx) - 8)

  const cloneScrollWidth = Math.max(1, (clone.scrollWidth || clone.offsetWidth || pageWidthPx))
  const scale = Math.min(1, pageWidthPx / cloneScrollWidth)
  const scaledFullHeight = (clone.scrollHeight || clone.offsetHeight) * scale
  let totalPages = Math.max(1, Math.ceil(scaledFullHeight / availableContentHeightPx))
  // If the last page would contain almost no content, drop it to avoid a blank page
  const remainingHeightPx = scaledFullHeight - (totalPages - 1) * availableContentHeightPx
  if (remainingHeightPx <= Math.max(12, availableContentHeightPx * 0.03) && totalPages > 1) {
    totalPages -= 1
  }

  // Refined heuristic: compute occupied area ratio for the final slice. If it contains
  // negligible visible content, drop the last page. This scans bounding boxes of
  // cloned elements intersecting the final slice region.
  try {
    // ensure measurer is attached so we can measure layout
    const cloneRect = clone.getBoundingClientRect()
    const sliceStartOrig = (totalPages - 1) * (availableContentHeightPx / scale)
    const sliceEndOrig = Math.min(clone.scrollHeight || clone.offsetHeight, sliceStartOrig + (availableContentHeightPx / scale))
    const sliceHeightOrig = Math.max(1, sliceEndOrig - sliceStartOrig)

    let occupiedArea = 0
    const elems: HTMLElement[] = [clone, ...Array.from(clone.querySelectorAll('*')) as HTMLElement[]]
    for (const el of elems) {
      try {
  const st = (doc as Window).getComputedStyle(el)
        if (!st || st.display === 'none' || st.visibility !== 'visible' || Number(st.opacity || '1') < 0.02) continue
        const r = el.getBoundingClientRect()
        // intersection with clone horizontal bounds
        const interLeft = Math.max(r.left, cloneRect.left)
        const interRight = Math.min(r.right, cloneRect.right)
        const interW = Math.max(0, interRight - interLeft)
        if (interW <= 0 || r.height <= 0) continue
        // compute vertical intersection with the target slice
        const sliceTop = cloneRect.top + sliceStartOrig
        const sliceBottom = cloneRect.top + sliceEndOrig
        const interTop = Math.max(r.top, sliceTop)
        const interBottom = Math.min(r.bottom, sliceBottom)
        const interH = Math.max(0, interBottom - interTop)
        if (interH <= 0) continue
        occupiedArea += interW * interH
      } catch {}
    }
    const sliceArea = Math.max(1, cloneRect.width * sliceHeightOrig)
    const occupiedRatio = occupiedArea / sliceArea
    // If less than 2% of the slice area contains visible content, drop it
    if (occupiedRatio < 0.02 && totalPages > 1) {
      totalPages -= 1
    }
  } catch (e) {
    // measurement failed — ignore and continue with previous heuristic
  }

  // create paginated pages
  const contentPages: HTMLElement[] = []
  for (let p = 0; p < totalPages; p++) {
    const page = doc.document.createElement('div')
    page.className = 'pdf-page'
    page.setAttribute('data-page', String(p + 1))
    page.style.width = `${pageWidthMm}mm`
    page.style.height = `${pageHeightMm}mm`
    page.style.overflow = 'hidden'
    page.style.position = 'relative'

  // header (only add if explicit metadata present)
    if (metaTitle || owner || school) {
      const headerEL = doc.document.createElement('div')
      headerEL.className = 'print-header'
      headerEL.style.position = 'relative'
      const logo = doc.document.createElement('img')
      logo.setAttribute('src', '/logo.png')
      logo.className = 'print-logo'
      logo.setAttribute('alt', 'logo')
      const titleEL = doc.document.createElement('div')
      titleEL.className = 'print-title'
      titleEL.textContent = owner ? `${metaTitle} — ${owner}` : metaTitle
      const metaEL = doc.document.createElement('div')
      metaEL.className = 'print-meta'
      metaEL.textContent = `${school ? school + ' • ' : ''}${new Date().toLocaleString()}`
      headerEL.appendChild(logo)
      headerEL.appendChild(titleEL)
      headerEL.appendChild(metaEL)
      page.appendChild(headerEL)
    }

    // page content wrapper (overflow:hidden) containing a cloned copy translated
    const pageContent = doc.document.createElement('div')
    pageContent.className = 'print-content'
    pageContent.style.position = 'relative'
    pageContent.style.width = '100%'
    pageContent.style.boxSizing = 'border-box'

    // insert a visible title above the first page content only if explicit metadata present
    if (p === 0 && (metaTitle || owner)) {
      const pageTitle = doc.document.createElement('h1')
      pageTitle.style.fontSize = '18px'
      pageTitle.style.margin = '8px 0'
      pageTitle.style.color = '#0f172a'
      pageTitle.textContent = owner ? `${metaTitle} — ${owner}` : metaTitle
      pageContent.appendChild(pageTitle)
    }

  const clonedSlice = clone.cloneNode(true) as HTMLElement
    clonedSlice.style.transformOrigin = 'top left'
    const offset = p * (pageInnerHeightPx / scale)
    clonedSlice.style.transform = `translateY(-${offset}px) scale(${scale})`
    // ensure cloned slice doesn't exceed width
    clonedSlice.style.width = `${cloneScrollWidth}px`
    clonedSlice.style.boxSizing = 'border-box'
  clonedSlice.style.position = 'relative'
  clonedSlice.style.zIndex = '2'

    pageContent.appendChild(clonedSlice)
    page.appendChild(pageContent)

    // footer with page number and school info
    const footer = doc.document.createElement('div')
    footer.className = 'page-footer'
    footer.style.position = 'absolute'
    footer.style.bottom = '6mm'
    footer.style.left = '18mm'
    footer.style.right = '18mm'
    footer.style.fontSize = '11px'
    footer.style.color = '#6b7280'
    footer.style.display = 'flex'
    footer.style.justifyContent = 'space-between'
    footer.style.alignItems = 'center'
    footer.innerHTML = `<div>${school || ''}</div><div>Page ${p + 1} of ${totalPages}</div>`
    page.appendChild(footer)

    // SVG watermark for better cross-browser print fidelity
    try {
      const svgNS = 'http://www.w3.org/2000/svg'
      const svg = doc.document.createElementNS(svgNS, 'svg')
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
      svg.style.position = 'absolute'
      svg.style.left = '0'
      svg.style.top = '0'
      svg.style.width = '100%'
      svg.style.height = '100%'
      svg.style.pointerEvents = 'none'
      svg.style.zIndex = '0'
      svg.setAttribute('aria-hidden', 'true')

      const viewW = page.clientWidth || 800
      const viewH = page.clientHeight || 1120
      svg.setAttribute('viewBox', `0 0 ${viewW} ${viewH}`)

      const text = doc.document.createElementNS(svgNS, 'text')
      text.setAttribute('x', String(viewW / 2))
      text.setAttribute('y', String(viewH / 2))
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'middle')
      text.setAttribute('fill', 'rgba(15,23,42,0.08)')
      text.setAttribute('font-size', '80')
      text.setAttribute('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial')
      text.setAttribute('transform', 'rotate(-30 ' + (viewW / 2) + ' ' + (viewH / 2) + ')')
      text.textContent = school || metaTitle || document.title || ''
      svg.appendChild(text)
      page.appendChild(svg)
    } catch (err) {
      // fallback to simple watermark div if SVG creation fails
      const wm = doc.document.createElement('div')
      wm.className = 'watermark'
      wm.textContent = school || metaTitle || document.title || ''
      wm.style.position = 'absolute'
      wm.style.left = '50%'
      wm.style.top = '50%'
      wm.style.transform = 'translate(-50%,-50%)'
      wm.style.opacity = '0.08'
      wm.style.fontSize = '48px'
      wm.style.pointerEvents = 'none'
      wm.style.zIndex = '0'
      page.appendChild(wm)
    }

    contentPages.push(page)
  }

  // remove measurer
  try { measurer.remove() } catch {}

  // append pages to wrapper
  contentPages.forEach((pg) => wrapper.appendChild(pg))
  doc.document.body.appendChild(wrapper)

  // print styles update for pagination and watermark
  const extraPrintCss = `
    .pdf-page{ page-break-after: always; display:block; margin:0 auto; background: #fff }
    .print-header{ display:flex; align-items:center; gap:12px; padding:6px 0 8px 0; border-bottom:1px solid #e5e7eb; z-index:5 }
    .page-footer{ z-index:5 }
  .watermark{ z-index:1; color: rgba(15,23,42,0.08); font-weight:700; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); pointer-events:none }
    .print-logo{ height:36px }
  `
  const styleEl = doc.document.createElement('style')
  styleEl.textContent = extraPrintCss
  doc.document.head.appendChild(styleEl)

  // wait for fonts to load then trigger print
  try { await (document as any).fonts?.ready } catch {}
  doc.focus()
  doc.print()
  return
}

function findOriginal(clonedNode: HTMLElement, originalRoot: HTMLElement, clonedRoot: HTMLElement) {
  // attempt to map cloned node back to original by walking parent chain and using index positions
  const path: number[] = []
  let n: Node | null = clonedNode
  while (n && n !== clonedRoot) {
    const parent: Node | null = n.parentNode
    if (!parent) break
    const idx = Array.prototype.indexOf.call((parent as ParentNode).childNodes, n)
    path.unshift(idx)
    n = parent
  }
  let cur: Node | null = originalRoot
  for (const i of path) {
    if (!cur || !cur.childNodes || cur.childNodes.length <= i) return null
    cur = cur.childNodes[i]
  }
  return cur as HTMLElement | null
}

export async function captureElementToPdf(elementId: string) {
  if (typeof window === 'undefined') throw new Error('captureElementToPdf must be run in the browser');
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element with id "${elementId}" not found`);

  // Dynamically import heavy browser libs so they don't run on server builds
  const { default: html2canvas } = await import('html2canvas');

    // color normalization is handled by normalizeElementColors above

    // Deprecated: use exported normalizeElementColors above when required
    const normalizeDomColors = (root: HTMLElement) => normalizeElementColors(root)

  // Install a temporary global shim that sanitizes canvas color assignments
  const uninstallSanitizer = installCanvasColorSanitizer()

  // Pre-normalize DOM colors that might break canvas parsing (oklch etc.)
  const changed = normalizeDomColors(el as HTMLElement)

  // Inline computed colors for the element subtree and pseudo-elements
  const restoreSubtree = sanitizeElementSubtree(el as HTMLElement)

  // Create a temporary sanitized stylesheet that replaces modern color() functions
  // with computed rgb() equivalents. This helps html2canvas.parseColor avoid errors.
  const removeSanitizedSheet = createSanitizedStylesheet()
  // Create CSS custom property overrides (for --vars that use oklch etc.)
  const removeVarOverrides = createCssVariableOverrides()
  try {
    const report = getLastSanitizedStylesheetReport()
    if (report && report.length) console.debug('sanitized stylesheet report', report)
    else console.debug('sanitized stylesheet created but no entries found')
  } catch (e) { console.debug('failed to read sanitized stylesheet report', e) }

  // Increase scale for better quality
  let canvas: HTMLCanvasElement | null = null
  try {
    canvas = await html2canvas(el as HTMLElement, { useCORS: true, scale: 2, backgroundColor: null });
  } catch (err) {
    // html2canvas failed (likely due to unsupported color functions). Fall back to DOM-clone + print.
    console.warn('html2canvas capture failed, falling back to DOM-clone print method', err)
    try {
      await captureElementByCloningAndPrint(elementId)
      return
    } catch (e) {
      console.error('Fallback print capture also failed', e)
      throw e
    }
  }

  // restore inline styles we overwrote
  changed.forEach(([node, prev]) => { if (prev == null) node.removeAttribute('style'); else node.setAttribute('style', prev) })

  // restore subtree modifications (pseudo-element rules and inline styles)
  try { restoreSubtree() } catch {}

  // uninstall the temporary sanitizer
  try { uninstallSanitizer() } catch {}

  // remove temporary stylesheet
  try { removeSanitizedSheet() } catch {}
  try { removeVarOverrides() } catch {}

    // Prepare a printable multi-page HTML using the canvas image slices.
    // This avoids importing jspdf/canvg and prevents webpack from bundling them.
    const pageWidthPx = 595 * 2 // approximate A4 at 72dpi scaled; we'll scale visually via CSS
    const pageHeightPx = 842 * 2
    const imgWidth = pageWidthPx
    const scale = imgWidth / canvas.width
    const totalHeight = canvas.height
    const pageHeightPxCanvas = Math.floor(pageHeightPx / scale)

    const slices: string[] = []
    let y = 0
    while (y < totalHeight) {
      const sliceHeight = Math.min(pageHeightPxCanvas, totalHeight - y)
      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = canvas.width
      sliceCanvas.height = sliceHeight
      const ctx = sliceCanvas.getContext('2d')
      if (!ctx) throw new Error('Unable to create canvas context')
      ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)
      slices.push(sliceCanvas.toDataURL('image/png'))
      y += sliceHeight
    }

    // Build printable HTML with header/footer and watermark so receipts look consistent
    const metaTitle = el.getAttribute('data-print-title') || el.getAttribute('data-title') || `${document.title || 'Export'}`
    const owner = el.getAttribute('data-for') || el.getAttribute('data-owner') || el.getAttribute('data-user') || ''
    const school = el.getAttribute('data-school') || document.querySelector('meta[name="school"]')?.getAttribute('content') || ''

  const headCss = `
      @page{size:A4;margin:18mm}
      body{font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin:0; padding:0; background:#fff}
      .pdf-page{width:210mm; height:297mm; box-sizing:border-box; padding:18mm; page-break-after:always; position:relative; background:#fff}
      .print-header{display:flex; align-items:center; gap:12px; border-bottom:1px solid #e5e7eb; padding-bottom:8px; margin-bottom:8px}
      .print-logo{height:36px}
      .print-title{font-weight:700; font-size:16px; color:#0f172a}
      .print-meta{margin-left:auto; color:#6b7280; font-size:12px}
      .print-content{display:flex; align-items:flex-start; justify-content:center; width:100%; height: calc(100% - 80px);}
      .print-content img{max-width:100%; height:auto; display:block; border:1px solid #e5e7eb; box-shadow:0 1px 2px rgba(0,0,0,0.04)}
      .page-footer{position:absolute; bottom:12mm; left:18mm; right:18mm; font-size:11px; color:#6b7280; display:flex; justify-content:space-between}
  .watermark-svg{position:absolute; left:0; top:0; width:100%; height:100%; pointer-events:none; z-index:0}
  /* Receipt wrapper helps center and preserve original layout for small receipts */
  .receipt-wrapper{width:100%; max-width:800px; margin:0 auto; display:block}
  .print-content{display:flex; align-items:flex-start; justify-content:center; width:100%; height: calc(100% - 80px);} 
    `

    const buildPageHtml = (src: string, idx: number, total: number) => {
      return `
        <div class="pdf-page">
          <div class="print-header">
            <img src="/logo.png" class="print-logo" alt="logo" />
            <div class="print-title">${owner ? `${metaTitle} — ${owner}` : metaTitle}</div>
            <div class="print-meta">${school ? school + ' • ' : ''}${new Date().toLocaleString()}</div>
          </div>
          <div class="print-content">
            <img src="${src}" alt="page-${idx + 1}" />
          </div>
          <div class="page-footer">
            <div>${school || ''}</div>
            <div>Page ${idx + 1} of ${total}</div>
          </div>
          <svg class="watermark-svg" viewBox="0 0 800 1120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <text x="400" y="560" text-anchor="middle" fill="rgba(15,23,42,0.08)" font-size="80" font-family='system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' transform="rotate(-30 400 560)">${(school || metaTitle || document.title || '').replace(/&/g, '&amp;')}</text>
          </svg>
        </div>
      `
    }

  // copy existing stylesheet links so receipts retain app CSS (fonts, utility classes)
  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((ln) => ln.outerHTML).join('\n')
    // Compose each raw canvas slice into a full A4 image with header/footer/watermark so
    // the downloaded PNG looks like the PDF page. If composition fails (CORS), fall back
    // to the raw slice data URL.
    const composedSlices: string[] = []
    for (let i = 0; i < slices.length; i++) {
      const src = slices[i]
      try {
        // create an image for the slice
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const im = new Image()
          im.crossOrigin = 'anonymous'
          im.onload = () => resolve(im)
          im.onerror = (e) => reject(e)
          im.src = src
        })

        // target page canvas size (px)
        const pageW = pageWidthPx
        const pageH = pageHeightPx
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = pageW
        pageCanvas.height = pageH
        const pctx = pageCanvas.getContext('2d')
        if (!pctx) throw new Error('Unable to create page canvas context')

        // background
        pctx.fillStyle = '#ffffff'
        pctx.fillRect(0, 0, pageW, pageH)

  // header area (only reserve if explicit metadata present)
  const headerH = (metaTitle || owner || school) ? Math.max(48, Math.floor(36 * (pageW / 800))) : 0
        pctx.fillStyle = '#0f172a'
        pctx.font = `${Math.max(14, Math.floor(14 * (pageW / 800)))}px system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`
        const titleText = owner ? `${metaTitle} — ${owner}` : metaTitle
        pctx.fillText(titleText, 36, 36)

        // draw the slice image centered into the remaining area
        const contentY = headerH + 12
        const contentH = pageH - contentY - 48
        const maxW = pageW - 72
        const scale = Math.min(1, maxW / img.width, contentH / img.height)
        const dw = Math.floor(img.width * scale)
        const dh = Math.floor(img.height * scale)
        const dx = Math.floor((pageW - dw) / 2)
        const dy = Math.floor(contentY + (contentH - dh) / 2)
        pctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh)

        // watermark
        pctx.save()
        pctx.globalAlpha = 0.08
        pctx.fillStyle = '#0f172a'
        pctx.font = `${Math.max(40, Math.floor(48 * (pageW / 800)))}px system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`
        pctx.translate(pageW / 2, pageH / 2)
        pctx.rotate((-30 * Math.PI) / 180)
        pctx.textAlign = 'center'
        pctx.textBaseline = 'middle'
        pctx.fillText(school || metaTitle || document.title || '', 0, 0)
        pctx.restore()

        composedSlices.push(pageCanvas.toDataURL('image/png'))
      } catch (err) {
        // composition failed (likely CORS); fallback to original slice
        composedSlices.push(src)
      }
    }

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${metaTitle}</title>${styleLinks}<style>${headCss}</style></head><body>${composedSlices.map((s, i) => buildPageHtml(s, i, composedSlices.length)).join('')}</body></html>`

    // Try to open a new window; if blocked, fall back to creating a blob URL and opening that
    let win = window.open('', '_blank')
    if (!win) {
      try {
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        win = window.open(url, '_blank')
      } catch (e) {
        throw new Error('Unable to open new window for PDF')
      }
    }
    if (!win) throw new Error('Unable to open new window for PDF')

    try {
      win.document.open()
      win.document.write(html)
      win.document.close()
      win.focus()
    } catch (e) {
      // if writing directly fails (some browsers), try to navigate the opened window to a blob URL
      try {
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        win.location.href = url
      } catch (err) {
        console.error('Failed to write print HTML to opened window', err)
      }
    }
  // Focus window so user can Print -> Save as PDF
  win.focus()
  return
}
