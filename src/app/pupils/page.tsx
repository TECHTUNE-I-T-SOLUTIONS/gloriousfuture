"use client"

import { useRouter } from "next/navigation"
import { BookOpen, Target, Users, Zap, Star, CheckCircle } from "lucide-react"
import CustomHeader from "@/components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

export default function PupilLanding() {
  const router = useRouter()

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Interactive Learning",
      description: "Engage with dynamic content, quizzes, and multimedia resources.",
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress tracking.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Collaborate",
      description: "Work together with classmates on studies and assignments.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Instant Feedback",
      description: "Get immediate feedback on assignments and assessments.",
    },
  ]

  const testimonials = [
    {
      name: "Emma Ayogbenro",
      grade: "Primary Five Pupil",
      content:
        "This platform makes learning so much more engaging! I love how I can take tests and see my results instantly and get help when I need it.",
    },
    {
      name: "Alex Ajayi",
      grade: "Primary Two Pupil",
      content: "The collaborative features are amazing. Working on group projects has never been easier!",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/50 via-indigo-600 to-indigo-900/90">
      <CustomHeader />
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mb-4">
          <button onClick={() => router.push('/')} className="text-sm text-primary hover:underline">← Back to Home</button>
        </div>
      </div> */}
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-primary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-22 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-8">
              <Star className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-card-foreground">Join 5,000+ pupils</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Unlock Your
              <span className="text-primary block">Learning Potential</span>
            </h1>

            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto text-pretty">
              Experience interactive learning at your fingertips. Access assignments, collaborate with peers, and track
              your academic progress all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push("/pupils/Signup")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Join as a Pupil
              </button>
              <button
                onClick={() => router.push("/pupils/Login")}
                className="bg-card hover:bg-muted text-card-foreground px-8 py-4 rounded-lg font-semibold text-lg border border-border transition-all duration-200 hover:shadow-md"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Learn Smarter, Not Harder</h2>
            <p className="text-lg text-gray-900 max-w-2xl mx-auto">
              Discover tools designed to make your learning experience more engaging and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-8 border border-border">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-100 mb-2">95%</div>
                <div className="text-gray-100 mb-4">Improved Grades</div>
                <div className="text-4xl font-bold text-gray-100 mb-2">3x</div>
                <div className="text-gray-100 mb-4">Faster Learning</div>
                <div className="text-4xl font-bold text-gray-100 mb-2">24/7</div>
                <div className="text-gray-100">Access to Resources</div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">Why Pupils Love Learning Here</h2>
              <div className="space-y-4">
                {[
                  "Access assignments and resources anytime, anywhere",
                  "Get instant feedback on your work",
                  "Collaborate easily with classmates",
                  "Track your progress and achievements",
                  "Learn at your own pace with personalized content",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-100 flex-shrink-0" />
                    <span className="text-sky-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Pupils Are Saying</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background rounded-xl p-8 shadow-sm border border-border">
                <p className="text-foreground mb-6 text-lg italic">&quot;{testimonial.content}&quot;</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.grade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Tips Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-100 mb-4">Study Smarter with These Tips</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Set Clear Goals",
                description: "Break down your learning objectives into manageable, achievable goals.",
                tip: "Use our progress tracking to monitor your achievements!",
              },
              {
                title: "Stay Organized",
                description: "Keep your assignments, notes, and resources organized in one place.",
                tip: "Our platform automatically organizes everything for you.",
              },
              {
                title: "Collaborate Often",
                description: "Work with classmates to share ideas and learn from each other.",
                tip: "Use our collaboration tools to connect with peers.",
              },
            ].map((tip, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-3">{tip.title}</h3>
                <p className="text-gray-500 mb-4">{tip.description}</p>
                <div className="bg-secondary/10 rounded-lg p-3">
                  <p className="text-sm text-secondary font-medium">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-100 mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-lg text-gray-100 mb-8">
            Join hundreds of thousands of pupils who are already achieving their academic goals with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/pupils/Signup")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Here
            </button>
            <button
              onClick={() => router.push("/pupils/Login")}
              className="bg-card hover:bg-muted text-card-foreground px-8 py-4 rounded-lg font-semibold text-lg border border-border transition-all duration-200 hover:shadow-md"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
      <CustomFooter/>
    </div>
  )
}
