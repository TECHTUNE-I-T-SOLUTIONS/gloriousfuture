// client-only installer for canvas color sanitizer
// installs the sanitizer immediately when this module is imported in the browser
import { installCanvasColorSanitizer } from './clientPdf'

// Export the uninstall function in case other code wants to remove it later
let uninstall: (() => void) | null = null

if (typeof window !== 'undefined') {
  try {
    uninstall = installCanvasColorSanitizer()
  } catch (err) {
    // best-effort; don't crash the app
    console.debug('failed to install canvas color sanitizer', err)
  }
}

export function uninstallCanvasColorSanitizer() {
  if (uninstall) {
    try { uninstall() } catch { /* ignore */ }
    uninstall = null
  }
}

export default uninstallCanvasColorSanitizer
