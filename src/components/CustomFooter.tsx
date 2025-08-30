import { motion } from "framer-motion"
import Image from "next/image"

export default function CustomFooter() {

return(
<footer className="relative bg-primary text-primary-foreground py-12 z-10">
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
    )
}