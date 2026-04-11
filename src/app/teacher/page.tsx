"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Users, BarChart3, Calendar, Award, CheckCircle } from "lucide-react"
import CustomHeader from "@/components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

export default function TeacherLanding() {
  const router = useRouter()

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Class Management",
      description: "Organize students, track attendance, and manage classroom activities effortlessly.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Assignment Creation",
      description: "Create, distribute, and grade assignments with our intuitive tools.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Progress Tracking",
      description: "Monitor student performance with detailed analytics and reports.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Schedule Management",
      description: "Plan lessons, set deadlines, and coordinate with your teaching calendar.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Taiwo",
      role: "Nursery Two Teacher",
      content:
        "This platform has transformed how I manage my classroom. The analytics help me identify struggling students early.",
    },
    {
      name: "Michael Ayomide",
      role: "Primary Three Teacher",
      content: "The assignment tools are incredible. I can create engaging content and track progress in real-time.",
    },
  ]

  const [testiIndex, setTestiIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTestiIndex((i) => (i + 1) % testimonials.length), 5200)
    return () => clearInterval(t)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/50 via-indigo-600 to-indigo-900/90">
      <CustomHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* <div className="mb-4">
          <button onClick={() => router.push('/')} className="text-sm text-primary hover:underline">← Back to Home</button>
        </div> */}
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-8">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">Trusted by 5,000+ Teachers</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Empower Your
              <span className="text-primary block">Teaching Journey</span>
            </h1>

            <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto text-pretty">
              See how we&apos;ve transformed our classroom with powerful tools designed to enhance engagement, streamline grading, and
              foster meaningful connections with our students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push("/teacher/Signup")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                New here as a Teacher?
              </button>
              <button
                onClick={() => router.push("/teacher/Login")}
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Help Pupils Excel</h2>
            <p className="text-lg text-gray-900 max-w-2xl mx-auto">Tools designed to streamline teaching and improve learning outcomes.</p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-200"
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 110 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Our Teachers love Our Platform</h2>
              <div className="space-y-4">
                {[
                  "Save 5+ hours per week on administrative tasks",
                  "Increase student engagement by 40% on average",
                  "Access detailed analytics and progress reports",
                  "Collaborate seamlessly with colleagues",
                  "Mobile-friendly design for teaching on the go",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-stone-100/60 to-stone-900/40 rounded-2xl p-8 border border-border">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">1,000+</div>
                <div className="text-gray-100 mb-4">Active Teachers</div>
                <div className="text-4xl font-bold text-white mb-2">5K+</div>
                <div className="text-gray-100 mb-4">Students Reached</div>
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-gray-100">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Teachers Are Saying</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.div
              className="col-span-1 bg-background rounded-xl p-8 shadow-sm border border-border"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-foreground mb-6 text-lg italic">“{testimonials[testiIndex].content}”</p>
              <div>
                <div className="font-semibold text-foreground">{testimonials[testiIndex].name}</div>
                <div className="text-gray-500">{testimonials[testiIndex].role}</div>
              </div>
            </motion.div>

            <div className="col-span-1 flex flex-col gap-4">
              {testimonials.map((t, i) => (
                <motion.button
                  key={i}
                  onClick={() => setTestiIndex(i)}
                  className={`text-left p-4 rounded-lg border border-border bg-background hover:bg-card/60 transition`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <div className="font-medium text-foreground">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Join Us As We Transform Our Teaching?</h2>
          <p className="text-lg text-gray-100 mb-8">
            Join other teachers who are already using our platform to create better learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/teacher/Signup")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue Here
            </button>
            <button
              onClick={() => router.push("/teacher/Login")}
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
