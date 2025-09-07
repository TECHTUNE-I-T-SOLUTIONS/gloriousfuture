import React from 'react'
import TimetableExample from './TimetableExample'
import ReceiptExample from './ReceiptExample'

export default function ExamplesPage() {
  return (
    <main style={{padding:24}}>
      <h1>Export Examples</h1>
      <section style={{marginBottom:24}}>
        <h2>Timetable</h2>
        <TimetableExample />
      </section>
      <section>
        <h2>Receipt</h2>
        <ReceiptExample />
      </section>
    </main>
  )
}
