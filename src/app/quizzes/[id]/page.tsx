import QuizPlayer from '@/components/quizzes/QuizPlayer'
import { Suspense } from 'react'

async function QuizPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <QuizPlayer quizId={id} />
}

export default function QuizPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading quiz...</div>}>
      <QuizPageContent params={props.params} />
    </Suspense>
  )
}
