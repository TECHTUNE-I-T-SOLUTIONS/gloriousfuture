"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { FaTimes, FaFilePdf, FaImage } from "react-icons/fa"
// Note: avoid importing heavy/browser-only libs (html-to-image, jspdf) at module scope to prevent build-time bundling issues

type Payment = {
  id: string
  amount: number
  status: string
  payment_method?: string | null
  payment_reference?: string | null
  paid_at?: string | null
  created_at?: string | null
  terms?: string[] | null
}

// minimal jspdf shape used at runtime
// NOTE: we intentionally avoid importing jspdf at module scope. We'll dynamically import and narrow it at runtime.

export default function ReceiptModal({
  payment,
  open,
  onClose,
}: { payment: Payment | null; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(false)

  // minimal jsPDF constructor type used in dynamic import flows
  // (jsPDF type is declared locally where used to avoid unused-type lint warnings)

  if (!open || !payment) return null

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount)

  const getLogoDataUrl = async (): Promise<string> => {
    // Generate a raster PNG at runtime using an offscreen canvas. This guarantees a
    // true PNG data URL is available for html-to-image / canvas operations and avoids
    // any CORS/network issues that can occur when fetching /logo.png.
    try {
      if (typeof document !== "undefined") {
        const size = 80
        const canvas = document.createElement("canvas") as HTMLCanvasElement
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (ctx) {
          // Background
          ctx.fillStyle = "#4f46e5"
          const radius = 12
          // Rounded rect
          const w = size
          const h = size
          ctx.beginPath()
          ctx.moveTo(radius, 0)
          ctx.lineTo(w - radius, 0)
          ctx.quadraticCurveTo(w, 0, w, radius)
          ctx.lineTo(w, h - radius)
          ctx.quadraticCurveTo(w, h, w - radius, h)
          ctx.lineTo(radius, h)
          ctx.quadraticCurveTo(0, h, 0, h - radius)
          ctx.lineTo(0, radius)
          ctx.quadraticCurveTo(0, 0, radius, 0)
          ctx.closePath()
          ctx.fill()

          // Text
          ctx.fillStyle = "#ffffff"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.font = "bold 18px Arial, Helvetica, sans-serif"
          ctx.fillText("GFA", size / 2, size / 2 - 6)
          ctx.font = "10px Arial, Helvetica, sans-serif"
          ctx.fillText("ACADEMY", size / 2, size / 2 + 18)

          return canvas.toDataURL("image/png")
        }
      }
    } catch (err) {
      // If canvas generation fails for any reason, fall back to an embedded SVG
      console.warn("Canvas logo generation failed, falling back to SVG.", err)
    }

    // Fallback SVG (base64) to ensure we always return a data URL
    const svgLogo = `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="12" fill="#4f46e5"/><text x="40" y="30" textAnchor="middle" fill="white" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="bold">GFA</text><text x="40" y="50" textAnchor="middle" fill="white" fontFamily="Arial, Helvetica, sans-serif" fontSize="8">ACADEMY</text></svg>`
    try {
      return `data:image/svg+xml;base64,${btoa(svgLogo)}`
    } catch {
      return `data:image/svg+xml,${encodeURIComponent(svgLogo)}`
    }
  }

  const buildReceiptHtml = (innerHtml: string, logoDataUrl?: string) => {
    const logoImg = logoDataUrl
      ? `<img src="${logoDataUrl}" alt="logo" style="width:80px;height:80px;object-fit:contain;border-radius:8px;"/>`
      : `<div style="width:80px;height:80px;background:#4f46e5;border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px;">GFA</div>`

    return `<!doctype html><html><head><meta charset="utf-8"><title>Receipt</title><meta name="viewport" content="width=device-width,initial-scale=1"/><style>
      * { box-sizing: border-box; }
      body{font-family:'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;margin:0;padding:24px;background:#f8fafc;line-height:1.5}
      .receipt{max-width:760px;margin:0 auto;padding:32px;background:#ffffff;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.1);color:#1e293b;border:1px solid #e2e8f0}
      .header{display:flex;align-items:center;gap:20px;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e2e8f0}
      .logo{width:80px;height:80px;flex-shrink:0}
      .school{font-size:24px;font-weight:700;color:#1e293b;margin-bottom:4px}
      .subtitle{color:#64748b;font-size:14px;font-weight:500}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px}
      .field{margin-bottom:16px}
      .label{font-size:12px;color:#64748b;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
      .value{font-weight:600;color:#1e293b;font-size:14px}
      .footer{margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;text-align:center}
      @media print { body { background: white; padding: 0; } .receipt { box-shadow: none; border: none; } }
    </style></head><body><div class="receipt"><div class="header">${logoImg}<div><div class="school">Glorious Future Academy</div><div class="subtitle">Official Payment Receipt</div></div></div><div class="grid">${innerHtml}</div><div class="footer">This is a system generated receipt from Glorious Future Academy. For enquiries, contact the school administration.</div></div></body></html>`
  }

  const inlineComputedStyles = (root: HTMLElement) => {
    const props = [
      "background",
      "background-color",
      "background-image",
      "color",
      "font",
      "font-size",
      "font-family",
      "font-weight",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "border",
      "border-radius",
      "box-shadow",
      "display",
      "width",
      "height",
      "line-height",
      "text-align",
      "vertical-align",
      "flex",
      "flex-direction",
      "align-items",
      "justify-content",
      "grid-template-columns",
      "gap",
      "opacity",
      "transform",
    ]
    const walk = (el: Element) => {
      if (el.nodeType !== Node.ELEMENT_NODE) return

      const cs = window.getComputedStyle(el as HTMLElement)
      const styleParts: string[] = []

      for (const p of props) {
        try {
          const v = cs.getPropertyValue(p)
          if (v && v !== "none" && v !== "auto" && v !== "normal") {
            styleParts.push(`${p}:${v}`)
          }
        } catch {}
      }

      if (styleParts.length) {
        const existingStyle = (el as HTMLElement).getAttribute("style") || ""
        const newStyle = existingStyle ? `${existingStyle};${styleParts.join(";")}` : styleParts.join(";")
        ;(el as HTMLElement).setAttribute("style", newStyle)
      }

      for (const child of Array.from(el.children)) {
        walk(child)
      }
    }
    walk(root)
  }

  const inlineImagesAndBackgrounds = async (root: HTMLElement) => {
    const fetchDataUrl = async (url: string): Promise<string> => {
      try {
        if (!url || url.startsWith("data:")) return url

        // Clean up the URL
        url = url.replace(/^["']|["']$/g, "")

        // Handle relative URLs
        if (url.startsWith("/")) {
          url = window.location.origin + url
        }

        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)

        const blob = await res.blob()
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error("FileReader failed"))
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.warn(`Failed to fetch ${url}:`, error)
        return url
      }
    }

    // Handle img elements
    const imgs = Array.from(root.querySelectorAll("img"))
    await Promise.all(
      imgs.map(async (img) => {
        try {
          const src = img.getAttribute("src") || img.src
          if (src && !src.startsWith("data:")) {
            const dataUrl = await fetchDataUrl(src)
            img.setAttribute("src", dataUrl)

            // Ensure dimensions are preserved
            if (!img.style.width && img.width) img.style.width = `${img.width}px`
            if (!img.style.height && img.height) img.style.height = `${img.height}px`
          }
        } catch (error) {
          console.warn("Failed to inline image:", error)
        }
      }),
    )

    // Handle background images
    const allElements = Array.from(root.querySelectorAll("*"))
    await Promise.all(
      allElements.map(async (el) => {
        try {
          const cs = window.getComputedStyle(el as HTMLElement)
          const bgImage = cs.getPropertyValue("background-image")

          if (bgImage && bgImage !== "none" && bgImage.includes("url(")) {
            // match url("...") or url('...') or url(...) and capture the URL
            const urlMatch = /url\((?:["']?)([^"')]+)(?:["']?)\)/.exec(bgImage)
            if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith("data:")) {
              const dataUrl = await fetchDataUrl(urlMatch[1])
              ;(el as HTMLElement).style.backgroundImage = `url("${dataUrl}")`
            }
          }
        } catch (error) {
          console.warn("Failed to inline background image:", error)
        }
      }),
    )
  }

  // Wait for all images within the node to finish loading (or error) before capture
  const waitForImagesToLoad = async (root: HTMLElement, timeout = 5000) => {
    const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[]
    if (imgs.length === 0) return
    await Promise.race([
      Promise.all(
        imgs.map((img) =>
          new Promise<void>((resolve) => {
            try {
              if (img.complete) return resolve()
              const onEnd = () => {
                img.removeEventListener('load', onEnd)
                img.removeEventListener('error', onEnd)
                resolve()
              }
              img.addEventListener('load', onEnd)
              img.addEventListener('error', onEnd)
            } catch {
              resolve()
            }
          }),
        ),
      ),
      new Promise<void>((resolve) => setTimeout(resolve, timeout)),
    ])
  }

  // Inline stylesheet contents from <link rel="stylesheet"> into the clone to preserve Tailwind/generated CSS
  const inlineStylesheetsIntoClone = async (clone: HTMLElement) => {
    try {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[]
      const parts: string[] = []
      // Minimal brand CSS to guarantee colors/backgrounds for capture when stylesheet inlining fails
      const minimalCss = `
        .receipt { background: #ffffff !important; color: #1e293b !important; }
        .header { border-bottom: 2px solid #e2e8f0 !important; }
        .school { color: #1e293b !important; }
        .subtitle { color: #64748b !important; }
        .footer { color: #64748b !important; }
        body { background: #f8fafc !important; }
      `
      // include minimalCss first so it always exists
      parts.push(minimalCss)

      // Only attempt to fetch same-origin stylesheets. Remote vendor CSS (e.g. paystack)
      // is often served without CORS headers and will fail fetch or cause cssRules access
      // to throw SecurityError. Skip cross-origin sheets and rely on minimalCss instead.
      await Promise.all(
        links.map(async (link) => {
          try {
            const href = link.href
            if (!href) return
            const url = new URL(href, window.location.href)
            if (url.origin !== window.location.origin) {
              // If this is the known paystack stylesheet, fetch via the server-side proxy
              const paystackCss = 'https://paystack.com/public/css/button.min.css'
              if (href === paystackCss) {
                try {
                  const proxyUrl = `/api/proxy-css?u=${encodeURIComponent(href)}`
                  const pres = await fetch(proxyUrl)
                  if (!pres.ok) return
                  const ptext = await pres.text()
                  parts.push(ptext)
                } catch {
                  // ignore proxy errors
                }
                return
              }
              // skip other cross-origin external stylesheets
              return
            }
            const res = await fetch(href)
            if (!res.ok) return
            const text = await res.text()
            parts.push(text)
          } catch {
            // ignore fetch/access errors; we already have minimalCss as fallback
            // console.debug('skip stylesheet', link.href)
          }
        }),
      )

      // Also try to capture any accessible stylesheet rules available via document.styleSheets
      // but skip cross-origin styleSheets which throw when reading cssRules.
      try {
        for (const ss of Array.from(document.styleSheets)) {
          try {
            const ssheet = ss as CSSStyleSheet
            // If stylesheet has an href and it's cross-origin, skip reading cssRules
            if (ssheet.href) {
              try {
                const sUrl = new URL(ssheet.href, window.location.href)
                if (sUrl.origin !== window.location.origin) continue
              } catch {
                // if URL parsing fails, skip
                continue
              }
            }

            const rules = ssheet.cssRules
            if (!rules) continue
            let cssText = ""
            for (const r of Array.from(rules)) {
              try {
                cssText += (r as CSSRule).cssText + "\n"
              } catch {
                // some rules may throw on access, ignore
              }
            }
            if (cssText) parts.push(cssText)
          } catch {
            // ignore stylesheets we can't access due to CORS or other restrictions
          }
        }
      } catch {
        // ignore
      }
      if (parts.length) {
        const s = document.createElement("style")
        s.setAttribute("data-inlined", "true")
        s.textContent = parts.join("\n")
        clone.insertBefore(s, clone.firstChild)
      }
    } catch (err) {
      console.warn("inlineStylesheetsIntoClone failed", err)
    }
  }

  // Ensure the cloned node contains a proper <img> with the embedded logo data URL.
  const replaceLogoElementsInClone = async (clone: HTMLElement, logoData: string) => {
    try {
      let replaced = false

      const imgs = Array.from(clone.querySelectorAll('img'))
      imgs.forEach((img) => {
        try {
          const src = img.getAttribute('src') || img.src || ''
          const alt = (img.getAttribute('alt') || img.alt || '').toLowerCase()
          if (alt.includes('logo') || src.includes('logo') || src.endsWith('/logo.png')) {
            img.setAttribute('src', logoData)
            img.style.width = '80px'
            img.style.height = '80px'
            img.style.objectFit = 'contain'
            replaced = true
          }
        } catch {}
      })

      if (!replaced) {
        // Try to find the header/logo container and insert an <img>
        const header = clone.querySelector('.header') as HTMLElement | null
        if (header) {
          const existingLogoSlot = header.querySelector('.logo') as HTMLElement | null
          const target = existingLogoSlot || header.querySelector('div')
          if (target) {
            const img = document.createElement('img')
            img.src = logoData
            img.alt = 'logo'
            img.style.width = '80px'
            img.style.height = '80px'
            img.style.objectFit = 'contain'
            img.style.borderRadius = '8px'
            target.insertBefore(img, target.firstChild)
            replaced = true
          }
        }
      }
    } catch (err) {
      console.warn('replaceLogoElementsInClone failed', err)
    }
  }

  const downloadImage = async () => {
    if (!ref.current) return
    setLoading(true)
    try {
      const logoData = await getLogoDataUrl()

    // capture the cloned node (inline images to avoid taint)
  const node = ref.current
  const clone = node.cloneNode(true) as HTMLElement

      const imgs = clone.querySelectorAll("img")
      imgs.forEach((img) => {
        try {
          const src = img.getAttribute("src") || img.src || ""
          const alt = (img.getAttribute("alt") || img.alt || "").toLowerCase()
          if (alt.includes("logo") || src.includes("logo") || src.endsWith("/logo.png")) {
            img.setAttribute("src", logoData)
            img.style.width = "80px"
            img.style.height = "80px"
            img.style.objectFit = "contain"
          }
        } catch (error) {
          console.warn("Failed to replace logo in clone:", error)
        }
      })

      const container = document.createElement("div")
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 760px;
        background: #ffffff;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        box-sizing: border-box;
        padding: 20px;
      `

      container.appendChild(clone)
      document.body.appendChild(container)

      try {
        // Ensure the clone contains a guaranteed logo image, then inline styles/images
        await replaceLogoElementsInClone(clone, logoData)
        await inlineStylesheetsIntoClone(clone)
        await inlineImagesAndBackgrounds(clone)
        inlineComputedStyles(clone)

    // Ensure images finish loading in the clone before capture
    await waitForImagesToLoad(clone, 3000)

        // Use html2canvas at runtime for robust DOM -> canvas capture. html-to-image
        // tries to read document.styleSheets.cssRules which throws for cross-origin
        // stylesheets; html2canvas avoids that and is more tolerant in practice.
        try {
          const h2cModule = await import("html2canvas").catch(() => null)
          const h2cCandidate = h2cModule ? (h2cModule.default || h2cModule) as unknown : null
          if (h2cCandidate) {
            const html2canvas = h2cCandidate as (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement>
            try {
              const canvas = await html2canvas(clone as HTMLElement, {
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false,
                scale: Math.max(1, window.devicePixelRatio || 1),
                width: 800,
                height: 600,
              })
              if (canvas && typeof canvas.toDataURL === "function") {
                const dataUrl = canvas.toDataURL("image/png")
                const a = document.createElement("a")
                a.href = dataUrl
                a.download = `receipt-${payment.payment_reference || payment.id}.png`
                document.body.appendChild(a)
                a.click()
                a.remove()
                return
              }
            } catch (e) {
              console.warn("html2canvas capture failed:", e)
            }
          }
        } catch {
          console.warn("html2canvas dynamic import failed")
        }
      } finally {
        container.remove()
      }

      const canvas = document.createElement("canvas")
      const width = 800
      const height = 600
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // White background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, width, height)

        try {
          const logoImg = document.createElement("img") as HTMLImageElement
          logoImg.crossOrigin = "anonymous"

          await new Promise<void>((resolve) => {
            logoImg.onload = () => {
              try {
                ctx.drawImage(logoImg, 32, 32, 80, 80)
              } catch {
                // Draw fallback logo
                ctx.fillStyle = "#4f46e5"
                ctx.fillRect(32, 32, 80, 80)
                ctx.fillStyle = "#ffffff"
                ctx.font = "bold 16px Arial"
                ctx.textAlign = "center"
                ctx.fillText("GFA", 72, 75)
              }
              resolve()
            }
            logoImg.onerror = () => {
              // Draw fallback logo
              ctx.fillStyle = "#4f46e5"
              ctx.fillRect(32, 32, 80, 80)
              ctx.fillStyle = "#ffffff"
              ctx.font = "bold 16px Arial"
              ctx.textAlign = "center"
              ctx.fillText("GFA", 72, 75)
              resolve()
            }
            logoImg.src = logoData
          })
        } catch {
          // ignore
        }

        ctx.textAlign = "left"
        ctx.fillStyle = "#1e293b"
        ctx.font = "bold 24px Arial"
        ctx.fillText("Glorious Future Academy", 130, 60)

        ctx.font = "14px Arial"
        ctx.fillStyle = "#64748b"
        ctx.fillText("Official Payment Receipt", 130, 85)

        // Payment details with better formatting
        ctx.font = "14px Arial"
        ctx.fillStyle = "#1e293b"
        let yPos = 140

        const details = [
          `Amount: ${formatCurrency(payment.amount)}`,
          `Reference: ${payment.payment_reference || "N/A"}`,
          `Method: ${payment.payment_method || "N/A"}`,
          `Status: ${payment.status}`,
          `Term(s): ${Array.isArray(payment.terms) ? payment.terms.join(", ") : "N/A"}`,
          `Date: ${payment.paid_at || payment.created_at || "N/A"}`,
        ]

        details.forEach((detail) => {
          ctx.fillText(detail, 32, yPos)
          yPos += 25
        })

        const dataUrl = canvas.toDataURL("image/png")
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = `receipt-${payment.payment_reference || payment.id}.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
        return
      }

      // Final fallback: open printable window
      const w = window.open("", "_blank")
      if (!w) throw new Error("Unable to open new window")
      w.document.open()
      w.document.write(buildReceiptHtml(node.innerHTML, logoData))
      w.document.close()
      w.focus()
    } catch (err) {
      console.error("Image export failed:", err)
      window.alert("Image download failed. You can still print the receipt from the new tab.")
    } finally {
      setLoading(false)
    }
  }

  const downloadPdf = async () => {
    if (!ref.current) return
    setLoading(true)
    try {
      const node = ref.current
      const clone = node.cloneNode(true) as HTMLElement
      const logoData = await getLogoDataUrl()

      const imgs = clone.querySelectorAll("img")
      imgs.forEach((img) => {
        try {
          const src = img.getAttribute("src") || img.src || ""
          const alt = (img.getAttribute("alt") || img.alt || "").toLowerCase()
          if (alt.includes("logo") || src.includes("logo") || src.endsWith("/logo.png")) {
            img.setAttribute("src", logoData)
            img.style.width = "80px"
            img.style.height = "80px"
            img.style.objectFit = "contain"
          }
        } catch (error) {
          console.warn("Failed to replace logo in PDF clone:", error)
        }
      })

      // Attempt to capture the cloned node as an image (use html-to-image runtime)
      const container = document.createElement("div")
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 760px;
        background: #ffffff;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        box-sizing: border-box;
        padding: 20px;
      `

      container.appendChild(clone)
      document.body.appendChild(container)

      try {
        await replaceLogoElementsInClone(clone, logoData)
        await inlineStylesheetsIntoClone(clone)
        await inlineImagesAndBackgrounds(clone)
        inlineComputedStyles(clone)

        // Wait for images to load in the clone
        await waitForImagesToLoad(clone, 3000)

        // Use html2canvas at runtime for DOM -> canvas capture, then open the
        // captured image in a new tab so users can print/save as PDF via browser.
        const h2cModule = await import("html2canvas").catch(() => null)
        const h2cCandidate = h2cModule ? (h2cModule.default || h2cModule) as unknown : null
        if (h2cCandidate) {
          const html2canvas = h2cCandidate as (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement>
          const canvas = await html2canvas(clone as HTMLElement, {
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false,
            scale: Math.max(1, window.devicePixelRatio || 1),
          })
          if (canvas) {
            try {
              const imgData = canvas.toDataURL("image/png")
              const w = window.open("", "_blank")
              if (w) {
                w.document.write(`<img src="${imgData}" style="max-width:100%;height:auto;display:block;margin:0 auto" />`)
                w.document.title = "Receipt"
                w.document.close()
                w.focus()
                return
              }
            } catch (e) {
              console.warn("PDF creation from canvas failed:", e)
            }
          }
        }
      } catch (e) {
        console.warn("html2canvas/pdf capture failed:", e)
      } finally {
        container.remove()
      }

      // Final fallback: open printable window
      const w = window.open("", "_blank")
      if (!w) throw new Error("Unable to open new window")
      w.document.open()
      w.document.write(buildReceiptHtml(node.innerHTML, logoData))
      w.document.close()
      w.focus()
    } catch (err) {
      console.error("PDF export failed:", err)
      window.alert("PDF download failed. You can still print the receipt from the new tab.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Download Receipt</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div ref={ref} className="p-6 border rounded-lg bg-white shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold border border-gray-100">
                    <Image
                      src="/logo.png"
                      alt="Glorious Future Academy logo"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-lg object-contain border border-gray-100"
                      onError={() => {
                        // next/image doesn't expose the inner img directly in the event payload,
                        // so find the first img with the same alt within this container and hide it.
                        try {
                          const img = document.querySelector('img[alt="Glorious Future Academy logo"]') as HTMLImageElement | null
                          if (img) {
                            img.style.display = "none"
                            const fallback = img.nextElementSibling as HTMLElement | null
                            if (fallback) fallback.style.display = "flex"
                          }
                        } catch {}
                      }}
                    />
                    <div
                      className="text-center flex-col items-center justify-center"
                      style={{ display: "none" }}
                    >
                      <div className="text-sm font-bold">GFA</div>
                      <div className="text-xs font-medium">ACADEMY</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">Glorious Future Academy</div>
                  <div className="text-sm text-gray-600 font-medium">Official Payment Receipt</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Amount</div>
                  <div className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</div>
                  <div className="font-semibold text-gray-900 capitalize">{payment.status}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Method</div>
                  <div className="font-semibold text-gray-900">{payment.payment_method || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Reference</div>
                  <div className="font-mono text-sm font-semibold text-gray-900">
                    {payment.payment_reference || "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Term(s)</div>
                  <div className="font-semibold text-gray-900">
                    {Array.isArray(payment.terms) && payment.terms.length ? payment.terms.join(", ") : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Paid At</div>
                  <div className="font-semibold text-gray-900">{payment.paid_at || payment.created_at || "N/A"}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t text-xs text-gray-500 text-center">
                This is a system generated receipt from Glorious Future Academy. For enquiries, contact the school
                administration.
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch space-y-3">
            <button
              onClick={downloadPdf}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              <FaFilePdf /> {loading ? "Processing..." : "Download PDF"}
            </button>
            <button
              onClick={downloadImage}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              <FaImage /> {loading ? "Processing..." : "Download Image"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
