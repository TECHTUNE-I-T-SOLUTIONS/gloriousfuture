import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Joystick, Heart } from "lucide-react"

export default function CustomFooter() {

return(
<footer className="relative bg-indigo-900 text-primary-foreground py-10 z-10">
        <div className="max-w-6xl mx-auto px-6">
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
            <p className="text-primary-foreground/80 mb-4 text-center">
              Shaping minds, building futures, creating leaders of tomorrow.
            </p>

            {/* Donation CTA */}
            <div className="flex justify-center mb-6">
              <Link
                href="/donation"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
              >
                <Heart className="w-4 h-4" />
                Support Our Mission
              </Link>
            </div>

            {/* FunZone CTA */}
            <div className="flex justify-center mb-6">
              <Link
                href="/funzone"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
              >
                <Joystick className="w-4 h-4" />
                Explore FunZone
              </Link>
            </div>

            <p className="text-primary-foreground/60 text-center">
              &copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    )
}