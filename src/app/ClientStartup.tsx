"use client"
import React from 'react'
// importing this module triggers installation of the canvas sanitizer in the browser
import '../lib/canvasColorSanitizerClient'

export default function ClientStartup() {
  // empty component — side-effect import is the point
  return <React.Fragment />
}
