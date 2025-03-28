"use client";

import { useState, useEffect } from "react";

export default function TeacherBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", author: "Teacher" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch("/api/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: "", content: "", author: "Teacher" });
    fetchBlogs();
  };

  const handleEdit = (blog) => {
    setForm({ title: blog.title, content: blog.content, author: blog.author });
    setEditingId(blog.id);
  };

  const handleDelete = async (id) => {
    await fetch("/api/blogs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBlogs();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Blog Posts</h1>

      {/* Form to Add/Edit Blog Post */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"} Blog
        </button>
      </form>

      {/* Blog List */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center">Loading blogs...</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} className="border rounded-lg p-4 shadow-md bg-white mb-4">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-700 mt-2">{blog.content.substring(0, 100)}...</p>
              <div className="mt-4 flex space-x-2">
                <button onClick={() => handleEdit(blog)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(blog.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
