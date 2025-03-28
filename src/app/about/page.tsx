"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState, useCallback, useMemo } from "react";
import CustomHeader from "@/components/CustomHeader";

export default function About() {
  const [showContent, setShowContent] = useState(false);
  const [init, setInit] = useState(false);


  useEffect(() => {
    setTimeout(() => setShowContent(true), 2000);
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesOptions = useMemo(
    () => ({
      background: { color: "#2c308f" },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          outModes: { default: "out" },
          random: false,
          speed: 2,
          straight: false,
        },
        number: { density: { enable: true }, value: 100 },
        opacity: { value: 0.2 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-blue-700 to-blue-900 overflow-hidden flex flex-col">
      {/* Particles Background */}
      {init && <Particles id="particles-bg" options={particlesOptions} className="absolute top-0 left-0 w-full h-full z-0" />}

      {/* Header Section */}
      <CustomHeader />
      {/* Main Content */}
      {showContent && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative pt-24 px-6 flex-1 z-10"
        >
          <section className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">About Glorious Future Academy</h1>
            <p className="text-lg text-gray-100 mt-4">
              At Glorious Future Academy, we are dedicated to providing top-quality education with a strong emphasis on creativity, innovation, and excellence.
            </p>
          </section>

          {/* Info Sections */}
          <section className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800">Our Vision</h2>
              <p className="text-gray-600 mt-2">To inspire young minds and create a generation of innovative leaders.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800">Our Mission</h2>
              <p className="text-gray-600 mt-2">Providing quality education in a fun, engaging, and interactive learning environment.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800">Our History</h2>
              <p className="text-gray-600 mt-2">
                Established in 2020, Glorious Future Academy has been at the forefront of academic excellence, nurturing thousands of students towards greatness.
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800">Our Core Values</h2>
              <ul className="list-disc text-gray-600 mt-2 ml-4">
                <li>Excellence</li>
                <li>Integrity</li>
                <li>Innovation</li>
                <li>Discipline</li>
              </ul>
            </motion.div>
          </section>

          {/* Meet the Proprietress */}
          <section className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-white">Meet Our Proprietress</h2>
            <motion.div whileHover={{ scale: 1.05 }} className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
              <Image src="/proprietress.jpg" alt="Proprietress" width={150} height={150} className="rounded-full mx-auto" />
              <h3 className="text-2xl font-semibold mt-4 text-gray-800">Mrs. Alade</h3>
              <p className="text-gray-600 mt-2">
                Passionate about education, she has dedicated her life to shaping young minds and building a brighter future.
              </p>
              <Link
                href="https://wa.me/2348035770623" // Replace with actual WhatsApp number
                target="_blank"
                className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Chat on WhatsApp
              </Link>
            </motion.div>
          </section>

          {/* Location Details */}
          <section className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-white">Location</h2>
            <motion.div whileHover={{ scale: 1.05 }} className="mt-6 bg-transparent p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold font-glow mt-4 text-gray-100">Iba Village, Oro, Kwara state</h3>
            </motion.div>
          </section>

          {/* Sitemap */}
          <section className="mt-12 mb-10 text-gray-100 text-center">
            <h2 className="text-3xl font-bold text-white">Sitemap</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link href="/" className="text-lg text-gray-100 hover:underline">Home</Link>
              >>>>
              <Link href="/pupil" className="text-lg text-gray-100 hover:underline">Pupil Section</Link>
              >>>>
              <Link href="/teacher" className="text-lg text-gray-100 hover:underline">Teacher's Section</Link>
              >>>>
              <Link href="/blog" className="text-lg text-gray-100 hover:underline">Blog</Link>
              >>>>
              <Link href="/about" className="text-lg text-gray-100 hover:underline">About Us</Link>
              >>>>
              <Link href="/contact" className="text-lg text-gray-100 hover:underline">Contact Us</Link>
            </div>
          </section>
        </motion.main>
      )};

      {/* Fixed Footer */}
      <footer className="w-full bg-gray-900 text-white py-6 text-center bottom-0 left-0 z-10">
        <p>&copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
