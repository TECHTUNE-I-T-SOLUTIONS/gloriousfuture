"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { IOptions, RecursivePartial } from "@tsparticles/engine"
import { useEffect, useState, useMemo, useRef } from "react"
import {
  FiEye,
  FiTarget,
  FiClock,
  FiAward,
  FiMapPin,
  FiPhone,
  FiMail,
  FiExternalLink,
  FiUsers,
  FiBookOpen,
  FiHeart,
} from "react-icons/fi"
import { FaGraduationCap } from "react-icons/fa"
import CustomHeader from "@/components/CustomHeader"

export default function About() {
  // removed unused showContent state
  const [init, setInit] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const heroRef = useRef(null)
  const valuesRef = useRef(null)
  const teamRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" })
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" })

  // intentionally not animating delayed content at the moment

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  const particlesOptions = useMemo<RecursivePartial<IOptions>>(
    () => ({
      background: {
        color: "transparent",
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 2 },
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        color: { value: ["#2864E6FF", "#000000FF", "#FFFFFFFF"] },
        links: {
          color: "#8b5cf6",
          distance: 150,
          enable: true,
          opacity: 0.1,
          width: 1,
        },
        move: {
          enable: true,
          outModes: { default: "out" },
          random: false,
          speed: 1,
          straight: false,
        },
        number: { density: { enable: true }, value: 50 },
        opacity: { value: 0.3 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
  [],
  )

  const sections = [
    {
      icon: <FiEye className="w-8 h-8" />,
      title: "Our Vision",
      content:
        "To inspire young minds and create a generation of innovative leaders who will shape the future with wisdom, creativity, and integrity.",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: "Our Mission",
      content:
        "Providing quality education in a fun, engaging, and interactive learning environment that nurtures each pupil's unique potential.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "Our History",
      content:
        "Established in 2020, Glorious Future Academy has been at the forefront of academic excellence, nurturing thousands of pupils towards greatness.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Our Core Values",
      content: [
        "Excellence in all endeavors",
        "Integrity in character",
        "Innovation in learning",
        "Discipline in conduct",
      ],
      color: "from-orange-500 to-red-600",
    },
  ]

  const stats = [
    { icon: <FiUsers className="w-6 h-6" />, value: "500+", label: "pupils" },
    { icon: <FiBookOpen className="w-6 h-6" />, value: "50+", label: "Courses" },
    { icon: <FaGraduationCap className="w-6 h-6" />, value: "25+", label: "Teachers" },
    { icon: <FiHeart className="w-6 h-6" />, value: "5+", label: "Years" },
  ]

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-200 via-indigo-400 to-indigo-900 overflow-hidden">
  {init && <Particles id="particles-bg" options={particlesOptions} className="absolute inset-0 z-0" />}

      <CustomHeader />

      <motion.section ref={heroRef} style={{ y }} className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
              About{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-indigo-900 bg-clip-text text-transparent">
                Glorious Future
              </span>
              <br />
              Academy
            </h1>
            <motion.p
              className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              At Glorious Future Academy, we are dedicated to providing top-quality education with a strong emphasis on
          creativity, innovation, and excellence. We believe in nurturing every pupil&apos;s potential to create
            tomorrow&apos;s leaders.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-indigo-900 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-gray-900">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section ref={valuesRef} className="relative py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What Drives Us</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Our core principles guide everything we do, from curriculum design to pupil support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                className="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} text-white mr-4`}>
                      {section.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-primary">{section.title}</h3>
                  </div>

                  {Array.isArray(section.content) ? (
                    <ul className="space-y-2">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-500">
                          <div className="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 leading-relaxed">{section.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section ref={teamRef} className="relative py-20 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Meet Our Proprietress</h2>
            <p className="text-lg text-gray-100 mb-12">
              The visionary leader behind our educational excellence
            </p>
          </motion.div>

          <motion.div
            className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={teamInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
                <Image
                  src="/proprietress.png"
                  alt="Mrs. Alade - Proprietress"
                  fill
                  className="rounded-full object-cover shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20" />
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">Mrs. Alade</h3>
            <p className="text-secondary font-medium mb-6">Founder & Proprietress</p>
            <p className="text-gray-900 leading-relaxed mb-8 max-w-2xl mx-auto">
              Passionate about education and dedicated to excellence, Mrs. Alade has devoted her life to shaping young
              minds and building a brighter future. With years of experience in educational leadership, she continues to
              inspire both pupils and staff towards achieving their highest potential.
            </p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" whileHover={{ scale: 1.05 }}>
              <Link
                href="https://wa.me/2348035770623"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPhone className="w-4 h-4" />
                Chat on WhatsApp
                <FiExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href="mailto:christgloriousfuture@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiMail className="w-4 h-4" />
                Send Email
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Location */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Visit Us</h2>
              <div className="bg-gray-100/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-lg">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="p-3 bg-gradient-to-br from-secondary to-accent rounded-xl text-white mr-4">
                    <FiMapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">Our Location</h3>
                </div>
                <p className="text-lg text-gray-900">Iba Village, Oro, Kwara State, Nigeria</p>
              </div>
            </motion.div>

            {/* Sitemap */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Quick Links</h2>
              <div className="bg-gray-100/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/pupils", label: "pupils" },
                    { href: "/teacher", label: "Teachers" },
                    { href: "/blog", label: "Blog" },
                    { href: "/about", label: "About Us" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 p-3 text-gray-900 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
                    >
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <footer className="relative bg-indigo-900 text-primary-foreground py-12 z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <Image src="/apple-touch-icon.png" alt="Logo" width={40} height={40} className="rounded-lg mr-3" />
              <span className="text-xl font-bold">Glorious Future Academy</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Shaping minds, building futures, creating leaders of tomorrow.
            </p>
            <p className="text-primary-foreground/60">
              &copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
