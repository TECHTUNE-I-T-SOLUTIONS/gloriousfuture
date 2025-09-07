"use client"
import React from 'react'
import { captureElementToPdf } from '@/lib/clientPdf'

export default function ReceiptExample() {
  const id = 'receipt-export'
  return (
    <div style={{padding:20}}>
      <div id={id} data-print-title="Payment Receipt" data-school="Glorious Future School" data-for="Jane Smith" style={{border:'1px solid #e5e7eb', padding:16, background:'#fff', maxWidth:600}}>
        <h2 style={{margin:0, marginBottom:8}}>Payment Receipt</h2>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <div>
            <div><strong>Student:</strong> Jane Smith</div>
            <div><strong>Class:</strong> 5B</div>
          </div>
          <div>
            <div><strong>Receipt #</strong> RF-00123</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>
        <hr />
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <tbody>
            <tr><td style={{padding:8}}>Tuition Fee</td><td style={{padding:8, textAlign:'right'}}>₦50,000</td></tr>
            <tr><td style={{padding:8}}>Books</td><td style={{padding:8, textAlign:'right'}}>₦5,000</td></tr>
            <tr><td style={{padding:8}}>Transport</td><td style={{padding:8, textAlign:'right'}}>₦3,000</td></tr>
            <tr><td style={{padding:8}}><strong>Total</strong></td><td style={{padding:8, textAlign:'right'}}><strong>₦58,000</strong></td></tr>
          </tbody>
        </table>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={() => captureElementToPdf(id)}>Export Receipt</button>
      </div>
    </div>
  )
}
