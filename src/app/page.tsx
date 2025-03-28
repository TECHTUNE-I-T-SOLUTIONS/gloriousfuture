"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import axios from "axios";
import Link from "next/link";
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd";
import CartoonQuiz from "../components/CartoonQuiz";
import CustomHeader from "../components/CustomHeader";


// Custom Alert Component
const CustomAlert = ({ message, onClose }) => (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 items-right rounded shadow-lg z-60">
    <button onClick={onClose} className="p-1 ml-95 text-sm font-bold">X</button>
    <div> {message} </div>
  </div>
);


export default function Home() {
  const [showMainContent, setShowMainContent] = useState(false);
  const [images, setImages] = useState([]);
  const [gameImages, setGameImages] = useState([]);
  const [init, setInit] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [flippedCards, setFlippedCards] = useState(Array(9).fill(false));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [showGoodJob, setShowGoodJob] = useState(false);
  const [showGreatJob, setShowGreatJob] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowMainContent(true), 10000);
    fetchGameImages();
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  // Local image data
const imageList = [
  { id: "1", src: "/images/gallery/learning.jpg", title: "Learning in Action" },
  { id: "2", src: "/images/gallery/games.jpg", title: "Fun & Games" },
  { id: "3", src: "/images/gallery/computer-training.jpg", title: "Computer Training" },
  { id: "4", src: "/images/gallery/study.jpg", title: "Focused Study" },
  { id: "5", src: "/images/gallery/sports.jpg", title: "Sports & Athletics" },
  { id: "6", src: "/images/gallery/classroom.jpg", title: "Interactive Classroom" },
  { id: "7", src: "/images/gallery/library.jpg", title: "Library Sessions" },
  { id: "8", src: "/images/gallery/reading.jpg", title: "Reading Time" },
  { id: "9", src: "/images/gallery/writing.jpg", title: "Creative Writing" },
  { id: "10", src: "/images/gallery/music.jpg", title: "Music & Instrumental" },
  { id: "11", src: "/images/gallery/art.jpg", title: "Art & Drawing" },
  { id: "12", src: "/images/gallery/science-lab.jpg", title: "Science Lab Experiments" },
  { id: "13", src: "/images/gallery/coding-class.jpg", title: "Coding & Programming" },
  { id: "14", src: "/images/gallery/mathematics.jpg", title: "Mathematics Practice" },
  { id: "15", src: "/images/gallery/geography.jpg", title: "Exploring Geography" },
  { id: "16", src: "/images/gallery/history.jpg", title: "History Lessons" },
  { id: "17", src: "/images/gallery/chemistry.jpg", title: "Chemistry Experiments" },
  { id: "18", src: "/images/gallery/physics.jpg", title: "Physics in Action" },
  { id: "19", src: "/images/gallery/biology.jpg", title: "Biology & Nature Study" },
  { id: "20", src: "/images/gallery/group-study.jpg", title: "Collaborative Learning" },
];


  const fetchGameImages = async () => {
    if (!navigator.onLine) {
      setAlertMessage("You are offline. Check your internet connection.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random?query=cartoon,animals,kids&count=3&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );
      const fetchedImages = response.data.map((img) => img.urls.small);
      const shuffledImages = [...fetchedImages, ...fetchedImages, ...fetchedImages].sort(() => Math.random() - 0.5);
      setGameImages(shuffledImages);
    } catch (error) {
      setAlertMessage("You're offline, Please check your internet connection.");
    }
  };

  const toggleCard = (index) => {
    if (selectedCards.length < 3 && !flippedCards[index]) {
      const newSelected = [...selectedCards, index];
      const newFlipped = [...flippedCards];
      newFlipped[index] = true;
      setFlippedCards(newFlipped);
      setSelectedCards(newSelected);

      if (newSelected.length === 3) {
        setTimeout(() => checkMatch(newSelected), 1000);
      }
    }
  };

  const checkMatch = (selected) => {
    const [a, b, c] = selected;
    if (gameImages[a] === gameImages[b] && gameImages[b] === gameImages[c]) {
      setMatchedCards([...matchedCards, ...selected]);
      setShowGoodJob(true);
      setTimeout(() => setShowGoodJob(false), 1000);
    } else {
      const resetFlipped = [...flippedCards];
      selected.forEach((i) => (resetFlipped[i] = false));
      setFlippedCards(resetFlipped);
    }
    setSelectedCards([]);

    if (matchedCards.length + 3 === gameImages.length) {
      setTimeout(() => {
        setShowGreatJob(true);
        setTimeout(fetchGameImages, 2000);
      }, 1000);
    }
  };

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
    <div className="relative min-h-screen w-full bg-gradient-to-b from-blue-200 to-blue-500 flex flex-col">
      {init && <Particles id="particles-bg" options={particlesOptions} className="absolute top-0 left-0 w-full h-full z-0" />}

      {/* Header / Navigation */}
      <CustomHeader />

      {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />}

      {/* Welcome Screen */}
      {!showMainContent ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-screen text-center text-white z-10">
          <Image src="/apple-touch-icon.png" alt="School Logo" width={120} height={120} priority className="z-10"/>
          <h1 className="text-4xl font-bold mt-4">Glorious Future Academy</h1>
          <motion.p className="text-xl mt-2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}>
            Welcome to a brighter future of learning! 🎉
          </motion.p>
        </motion.div>
      ) : (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 px-6 relative z-10">
          <section className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">Welcome to Glorious Future Academy</h1>
            <p className="text-lg text-gray-100 mt-4">A place where learning meets fun, creativity, and innovation.</p>
          </section>

          <section className="max-w-6xl mx-auto mb-12 z-10">
            <h2 className="text-3xl font-bold text-white text-center mb-6">📸 Our School Moments</h2>

            <DragDropContext onDragEnd={() => {}}>
              <Droppable droppableId="images">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imageList.map((image, index) => (
                      <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided) => (
                          <motion.div 
                            ref={provided.innerRef} 
                            {...provided.draggableProps} 
                            {...provided.dragHandleProps} 
                            whileHover={{ scale: 1.05 }} 
                            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300"
                          >
                            <Image src={image.src} alt={image.title} width={400} height={300} className="w-full h-48 object-cover" />
                            <div className="p-4 text-center">
                              <h2 className="text-xl font-semibold text-gray-800">{image.title}</h2>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </section>

          {/* Rolling Text Animation */}
          <motion.div className="text-2xl text-white font-bold text-center my-10"
            animate={{ y: ["100%", "-100%"] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            🎓 Learning is Fun at Glorious Future Academy! 🚀
          </motion.div>

          {/* Memory Card Game */}
          <section className="text-center mt-10 relative">
            {showGoodJob && <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-xl py-2">🎉 Good Job! 🎉</div>}
            {showGreatJob && <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white text-xl py-2">🌟 Great Job! Restarting... 🌟</div>}
            
            <h2 className="text-3xl font-bold text-white">🎮 Memory Card Game</h2>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-6">
              {gameImages.map((image, index) => (
                <button key={index} className="bg-gray-300 p-2 rounded-lg" onClick={() => toggleCard(index)}>
                  {flippedCards[index] || matchedCards.includes(index) ? (
                    <Image src={image} alt="Memory" width={80} height={80} className="rounded-lg" />
                  ) : (
                    <span className="text-2xl">❓</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Extra Features & Activities */}
          <section className="text-center mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">🌟 School Features & Activities</h2>

            {/* Animated List of Features */}
            <div className="relative overflow-hidden h-40 w-full max-w-4xl mx-auto text-lg font-semibold text-white">
              <motion.div
                className="absolute w-full text-center"
                animate={{ y: ["100%", "-100%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <p className="mb-4">🏅 Sports Competitions & Games</p>
                <p className="mb-4">💻 Computer Training & Coding Classes</p>
                <p className="mb-4">📚 Extra Lessons & Tutoring</p>
                <p className="mb-4">🎨 Arts, Music & Creativity Programs</p>
                <p className="mb-4">🔬 Science Club & Innovation Hub</p>
                <p className="mb-4">🚀 Space & Astronomy Club</p>
              </motion.div>
            </div>

            {/* Website Features */}
            <h3 className="text-2xl font-bold text-white mt-10 mb-4">🖥️ Our Website Features</h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-white"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } }
              }}
            >
              <motion.div
                className="bg-blue-800 p-6 rounded-lg shadow-lg"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <h4 className="text-xl font-bold">🔒 Secure Exams</h4>
                <p className="text-gray-200">High-level security measures to prevent cheating.</p>
              </motion.div>

              <motion.div
                className="bg-blue-800 p-6 rounded-lg shadow-lg"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <h4 className="text-xl font-bold">📜 Curriculum Viewing</h4>
                <p className="text-gray-200">Easily access the academic curriculum anytime.</p>
              </motion.div>

              <motion.div
                className="bg-blue-800 p-6 rounded-lg shadow-lg"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <h4 className="text-xl font-bold">📊 Results & Report Cards</h4>
                <p className="text-gray-200">View and print results directly from your profile.</p>
              </motion.div>

              <motion.div
                className="bg-blue-800 p-6 rounded-lg shadow-lg"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <h4 className="text-xl font-bold">📝 Assignments & Projects</h4>
                <p className="text-gray-200">Submit and track assignments online.</p>
              </motion.div>

              <motion.div
                className="bg-blue-800 p-6 rounded-lg shadow-lg"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <h4 className="text-xl font-bold">📷 Pupil Profile Access</h4>
                <p className="text-gray-200">Manage student profiles securely with ease.</p>
              </motion.div>

              <motion.div
                className="bg-blue-800 p-6 rounded-lg shadow-lg"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <h4 className="text-xl font-bold">👨‍🏫 Virtual Learning</h4>
                <p className="text-gray-200">Attend lessons online with interactive tools.</p>
              </motion.div>
            </motion.div>
          </section>
          
          {/* Puzzle Game Section */}
          <CartoonQuiz />
        </motion.main>
      )};

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white mt-auto py-6 text-center z-10">
        <p>&copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}