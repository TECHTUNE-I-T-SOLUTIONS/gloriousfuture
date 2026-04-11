import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Joystick, Heart, BookOpen, Award, Mail, Phone, Home } from "lucide-react"
import { FiAward } from "react-icons/fi"

export default function CustomFooter() {
  const footerLinks = {
    quick: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Blog" },
    ],
    learning: [
      { href: "/pupils", label: "For Pupils" },
      { href: "/teacher", label: "For Teachers" },
      { href: "/quizzes", label: "Take a Quiz" },
    ],
    resources: [
      { href: "/funzone", label: "FunZone" },
      { href: "/donation", label: "Support Us" },
    ],
  }

  const contactInfo = [
    { icon: Phone, text: "+234 803 5770 623", href: "tel:+2348035770623" },
    { icon: Mail, text: "christgloriousfuture@gmail.com", href: "mailto:christgloriousfuture@gmail.com" },
  ]

  return (
    <footer className="relative bg-indigo-900 text-primary-foreground py-12 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8"
        >
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/apple-touch-icon.png" alt="Logo" width={40} height={40} className="rounded-lg" />
              <div>
                <h3 className="font-bold text-lg">Glorious</h3>
                <p className="text-xs text-primary-foreground/70">Future Academy</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Shaping minds, building futures, creating leaders of tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quick.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary-foreground/80 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-bold mb-4 text-white">Learning</h4>
            <ul className="space-y-2">
              {footerLinks.learning.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary-foreground/80 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary-foreground/80 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-white transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-primary-foreground/20 py-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center justify-center">
            {/* Quiz CTA */}
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              <Award className="w-4 h-4" />
              Take a Quiz
            </Link>

            {/* Donation CTA */}
            <Link
              href="/donation"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              <Heart className="w-4 h-4" />
              Support Us
            </Link>

            {/* FunZone CTA */}
            <Link
              href="/funzone"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              <Joystick className="w-4 h-4" />
              Explore FunZone
            </Link>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}