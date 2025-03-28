"use client";

import { useEffect, useState } from "react";
import { FaUserEdit, FaTrashAlt, FaSave, FaTimes, FaCamera } from "react-icons/fa";

export default function TeacherProfile() {
  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    email: "",
    class_taught: "",
    years_of_experience: "",
    uin: "",
    profile_picture: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/teacher/profile", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();

        setProfile(() => ({ ...data })); // ✅ Force state update
      } else {
        console.error("Failed to fetch profile:", await res.json());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.full_name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadProfilePicture = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/teacher/upload-profile-picture", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setProfile((prev) => ({ ...prev, profile_picture: data.url })); // ✅ Ensures UI updates
      }
    } catch (error) {
      console.error("Error uploading picture:", error);
    } finally {
      setUploading(false);
    }
  };

  const saveChanges = async () => {
    try {
      const res = await fetch("/api/teacher/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setEditing(false);
        fetchProfile(); // ✅ Ensures UI updates with latest data
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (!confirmDelete) return;

    try {
      await fetch("/api/teacher/profile", { method: "DELETE" });
      alert("Account deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
        <FaUserEdit className="mr-2 text-blue-500" /> Teacher Profile
      </h2>
      <p className="text-gray-600 mt-2">Manage your profile settings.</p>

      {loading ? (
        <p className="mt-4 text-gray-500">Loading profile...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <img
              src={profile.profile_picture || "/default-profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <label className="mt-2 flex items-center space-x-2 cursor-pointer">
              <FaCamera className="text-blue-500" />
              <span className="text-sm text-blue-500">Change Picture</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {selectedFile && (
              <button
                onClick={uploadProfilePicture}
                className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            )}
          </div>

          {/* Profile Details */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name || ""}
              disabled={!editing}
              onChange={handleChange}
              className="w-full text-black p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              disabled={!editing}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Class Taught</label>
            <input
              type="text"
              name="class_taught"
              value={profile.class_taught || ""}
              disabled={!editing}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Years of Experience</label>
            <input
              type="text"
              name="years_of_experience"
              value={profile.years_of_experience || ""}
              disabled={!editing}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Unique Identification Number (UIN)</label>
            <input
              type="text"
              name="uin"
              value={profile.uin || ""}
              disabled
              className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            {editing ? (
              <>
                <button onClick={saveChanges} className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
                  <FaSave className="mr-2" /> Save
                </button>
                <button onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center">
                  <FaTimes className="mr-2" /> Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
                <FaUserEdit className="mr-2" /> Edit Profile
              </button>
            )}
            <button onClick={deleteAccount} className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
              <FaTrashAlt className="mr-2" /> Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
