import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaWhatsapp, FaFacebook, FaLink } from "react-icons/fa";
import Image from "next/image";

interface BlogModalProps {
  blog: {
    id: string;
    title: string;
    content: string;
    author_name: string;
    author_role: "teacher" | "pupil";
    imageUrls?: string[];
  };
  onClose: () => void;
}

export default function BlogModal({ blog, onClose }: BlogModalProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.origin + `/blog/${blog.id}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative"
      >
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-700 hover:text-red-500" onClick={onClose}>
          <IoClose size={24} />
        </button>

        {/* Blog Content */}
        <h2 className="text-2xl font-bold">{blog.title}</h2>
        <p className="text-gray-600 mt-2">By {blog.author_name} ({blog.author_role})</p>

        {/* Display Images */}
        {blog.imageUrls && blog.imageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {blog.imageUrls.map((url, index) => (
              <Image key={index} src={url} alt="Blog Image" width={150} height={100} className="rounded-lg" />
            ))}
          </div>
        )}

        {/* Blog Text Content */}
        <p className="mt-4 text-gray-800">{blog.content}</p>

        {/* Share Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button onClick={copyToClipboard} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <FaLink size={20} />
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={24} className="text-green-600 hover:text-green-800" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={24} className="text-blue-600 hover:text-blue-800" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
