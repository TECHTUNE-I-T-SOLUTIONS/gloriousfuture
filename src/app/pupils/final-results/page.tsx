"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PupilFinalResults() {
  const [results, setResults] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/pupil/final-results', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setResults(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to load final results', err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [])

  if (loading) return <div className="py-12 text-center">Loading...</div>
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Final Results</h1>
      {results.length === 0 ? (
        <Card className="p-4">
          <CardContent>No final results are available yet.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {results.map((r) => (
            <Card key={r.id as string} className="p-4">
              <CardHeader>
                <CardTitle>Average: {String(r.average ?? '—')} — Grade: {String(r.grade ?? '—')}</CardTitle>
                <CardDescription className="text-sm">Generated: {r.created_at ? new Date(r.created_at as string).toLocaleString() : '—'}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(r.results, null, 2)}</pre>
                <div className="mt-2">
                  <Button asChild>
                    <a href={`/api/pupil/final-results/pdf?id=${r.id as string}`} target="_blank" rel="noreferrer">Download PDF</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
