"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/CustomLoader";
import { FaEnvelope } from "react-icons/fa";

export default function Messages() {
  const [messages, setMessages] = useState<{ sender: string; content: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaEnvelope className="mr-2 text-blue-500" /> Messages
      </h1>

      {loading ? <Loader /> : (
        messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg, index) => (
              <li key={index} className="p-4 bg-white rounded-md shadow-md border">
                <h2 className="font-bold">{msg.sender}</h2>
                <p>{msg.content}</p>
                <p className="text-sm text-gray-400">{msg.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No messages found.</p>
        )
      )}
    </div>
  );
}
