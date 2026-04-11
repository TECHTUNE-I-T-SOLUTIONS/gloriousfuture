"use client"

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { FiArrowRight } from 'react-icons/fi'

export default function QuizCard({ quiz }: { quiz: any }) {
  return (
    <Link href={`/quizzes/${quiz.id}`}>
      <div className="group h-full flex flex-col cursor-pointer">
        {/* Image Section */}
        <div className="relative w-full h-40 overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-300 to-indigo-600">
          <Image 
            src={quiz.thumbnail_url || '/logo.png'} 
            alt={quiz.title} 
            width={400} 
            height={200} 
            className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {quiz.title}
            </h3>
            <p className="text-sm text-indigo-700 line-clamp-2 mt-2">
              {quiz.description || 'Challenge yourself with this quiz'}
            </p>
          </div>

          {/* Footer with stats and CTA */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-indigo-100">
            <div className="text-xs text-indigo-600 font-semibold">
              {quiz.total_questions || 0} questions
            </div>
            <div className="text-indigo-600 group-hover:text-indigo-900 transition-colors">
              <FiArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

