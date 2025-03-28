"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaQuoteLeft } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TeacherBlog() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

// Fetch teacher details from session API
useEffect(() => {
  const fetchSessionAndTeacherDetails = async () => {
    try {
      // Fetch session details
      const sessionRes = await fetch("/api/auth/session");

      // Check if response is empty or invalid
      const sessionText = await sessionRes.text();
      console.log("Raw Session Response:", sessionText);

      // Try parsing JSON safely
      let sessionData;
      try {
        sessionData = JSON.parse(sessionText);
      } catch (jsonError) {
        throw new Error("Invalid JSON from session API.");
      }

      console.log("Session Response Status:", sessionRes.status);
      console.log("Parsed Session Data:", sessionData); // Debugging

      if (!sessionRes.ok || !sessionData?.session?.uin) {
        throw new Error(`Session fetch failed or missing UIN (status: ${sessionRes.status})`);
      }

      const uin = sessionData.session.uin;

      // Fetch teacher details using UIN
      const teacherRes = await fetch(`/api/teacher/blogdetails?uin=${uin}`);

      const teacherText = await teacherRes.text();
      console.log("Raw Teacher Response:", teacherText);

      let teacherData;
      try {
        teacherData = JSON.parse(teacherText);
      } catch (jsonError) {
        throw new Error("Invalid JSON from teacher API.");
      }

      console.log("Teacher Response Status:", teacherRes.status);
      console.log("Parsed Teacher Data:", teacherData);

      if (!teacherRes.ok || !teacherData?.success) {
        throw new Error("Failed to fetch teacher details.");
      }

      // Fetch user_id from users table
      const userRes = await fetch(`/api/teacher/get-user-id?uin=${uin}`);

      const userText = await userRes.text();
      console.log("Raw User Response:", userText);

      let userData;
      try {
        userData = JSON.parse(userText);
      } catch (jsonError) {
        throw new Error("Invalid JSON from user API.");
      }

      console.log("User Response Status:", userRes.status);
      console.log("Parsed User Data:", userData);

      if (!userRes.ok || !userData?.success) {
        throw new Error("Failed to fetch user ID.");
      }

      // Set teacher details
      setTeacherId(userData.user_id); // Use user_id as teacher ID
      setTeacherName(teacherData.teacher.full_name);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      alert(`Failed to fetch teacher details: ${error.message}`);
    }
  };

  fetchSessionAndTeacherDetails();
}, []);


  // Fetch blogs
  useEffect(() => {
    async function fetchBlogs() {
      const { data } = await supabase.from("blogs").select("*");
      setBlogs(data || []);
    }
    fetchBlogs();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      Blockquote,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });


  // Handle image selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Handle blog submission (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !teacherName) {
      alert("Failed to fetch teacher details.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author_id", teacherId);
    formData.append("author_name", teacherName);
    formData.append("author_role", "teacher");

    if (image) formData.append("image", image);

    if (editing) {
      formData.append("id", editId!.toString());
      await fetch("/api/blogs", { method: "PUT", body: formData });
    } else {
      await fetch("/api/blogs", { method: "POST", body: formData });
    }

    window.location.reload();
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    await fetch("/api/blogs", {
      method: "DELETE",
      body: JSON.stringify({ id, imageUrl }),
    });
    window.location.reload();
  };

  const handleEdit = (blog: any) => {
    setEditing(true);
    setEditId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    editor?.commands.setContent(blog.content);
    setImagePreview(blog.image_url);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Manage Blog Posts</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Editor Toolbar */}
        {editor && (
          <div className="mb-2 flex gap-2">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="p-1 border rounded">
              <FaBold />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="p-1 border rounded">
              <FaItalic />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="p-1 border rounded">
              <FaUnderline />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-1 border rounded">
              <FaListUl />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="p-1 border rounded">
              <FaListOl />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="p-1 border rounded">
              <FaQuoteLeft />
            </button>
          </div>
        )}

        {/* Rich Text Editor */}
        {editor && <EditorContent editor={editor} className="border p-2 rounded mb-4 bg-gray-50" />}

        <input type="file" onChange={handleImageChange} className="block w-full mb-4" />
        {imagePreview && <img src={imagePreview} className="w-full h-40 object-cover mb-4" />}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {editing ? "Update Blog" : "Create Blog"}
        </button>
      </form>

      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-xl font-bold">{blog.title}</h3>
              {blog.image_url && <img src={blog.image_url} className="w-full h-40 object-cover mt-2" />}
              <div dangerouslySetInnerHTML={{ __html: blog.content }} className="mt-2" />
              <div className="mt-4 flex gap-3">
                <button className="text-blue-500" onClick={() => handleEdit(blog)}>
                  <FaEdit />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(blog.id, blog.image_url)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
