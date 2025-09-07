// import { NextResponse } from 'next/server'
// import { chromium } from 'playwright'

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function renderReceiptHtml(data: any) {
//   // Minimal receipt HTML template — style inline for predictable rendering
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const rows = (data.items || []).map((it: any) => `<tr><td>${it.description}</td><td style="text-align:right">${it.amount}</td></tr>`).join('')
//   return `
//   <!doctype html>
//   <html>
//   <head>
//     <meta charset="utf-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <title>Receipt</title>
//     <style>
//       body{font-family: Arial, Helvetica, sans-serif; padding:24px}
//       .header{display:flex;justify-content:space-between;align-items:center}
//       table{width:100%;border-collapse:collapse;margin-top:16px}
//       td{padding:6px 8px;border-bottom:1px solid #eee}
//       .total{font-weight:700}
//     </style>
//   </head>
//   <body>
//     <div class="header"><div><h2>Receipt</h2><div>${data.pupilName || ''}</div></div><div>${data.date || ''}</div></div>
//     <div style="margin-top:12px">UIN: ${data.uin || ''} | Ref: ${data.ref || ''}</div>
//     <table>
//       <tbody>
//         ${rows}
//         <tr><td class="total">Total</td><td style="text-align:right" class="total">${data.total || ''}</td></tr>
//       </tbody>
//     </table>
//   </body>
//   </html>
//   `
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const html = renderReceiptHtml(body)

//     const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] })
//     try {
//       const context = await browser.newContext()
//       const page = await context.newPage()
//       await page.setContent(html, { waitUntil: 'networkidle' })
//   const pdf = await page.pdf({ format: 'A4', printBackground: true })
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const buffer = Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf as any)
//   const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
//   return new Response(arrayBuffer, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="receipt.pdf"' } })
//     } finally {
//       await browser.close()
//     }
//   } catch (err) {
//     console.error('receipt pdf error', err)
//     return NextResponse.json({ error: String(err) }, { status: 500 })
//   }
// }
