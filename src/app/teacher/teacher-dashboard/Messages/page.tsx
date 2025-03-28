"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  sender: string;
  content: string;
}

export default function TeacherMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/teacher/messages");
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Messages</h2>
      <ul className="space-y-3">
        {messages.map((msg) => (
          <li key={msg.id} className="p-4 bg-gray-100 rounded-md shadow-sm">
            <p className="text-lg font-bold">{msg.sender}</p>
            <p className="text-sm text-gray-600">{msg.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
