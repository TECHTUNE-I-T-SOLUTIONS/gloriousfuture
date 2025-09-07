"use client"
import React from 'react'
import { captureElementToPdf } from '@/lib/clientPdf'

export default function TimetableExample() {
  const id = 'timetable-export'
  return (
    <div style={{padding:20}}>
      <div id={id} data-print-title="Class Timetable" data-school="Glorious Future School" data-for="John Doe" style={{border:'1px solid #e5e7eb', padding:12, background:'#fff'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={{textAlign:'left', padding:8}}>Day</th>
              <th style={{textAlign:'left', padding:8}}>8:00</th>
              <th style={{textAlign:'left', padding:8}}>10:00</th>
              <th style={{textAlign:'left', padding:8}}>12:00</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{padding:8}}>Mon</td><td style={{padding:8}}>Maths</td><td style={{padding:8}}>Physics</td><td style={{padding:8}}>English</td></tr>
            <tr><td style={{padding:8}}>Tue</td><td style={{padding:8}}>Biology</td><td style={{padding:8}}>Chemistry</td><td style={{padding:8}}>History</td></tr>
            <tr><td style={{padding:8}}>Wed</td><td style={{padding:8}}>Coding</td><td style={{padding:8}}>Art</td><td style={{padding:8}}>Music</td></tr>
          </tbody>
        </table>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={() => captureElementToPdf(id)}>Export Timetable</button>
      </div>
    </div>
  )
}
