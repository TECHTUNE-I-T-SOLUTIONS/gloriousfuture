"use client"

import type React from "react"

import { useEffect, useState } from "react"
import CustomAlert from "@/components/CustomAlert"
import ConfirmModal from "@/components/ConfirmModal"
import { User, Mail, BookOpen, Camera, Save, X, Trash2, Edit3, Shield, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function TeacherProfile() {
  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    email: "",
    class_taught: "",
    years_of_experience: "",
    uin: "",
    profile_picture: "",
  })

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProfile()
    // fetch classes for dropdown
    ;(async () => {
      try {
        const res = await fetch("/api/teacher/classes", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setClasses(data || [])
        }
      } catch (err) {
        console.error("Failed to load classes", err)
      }
    })()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/teacher/profile", {
        method: "GET",
        credentials: "include",
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(() => ({ ...data }))
      } else {
        console.error("Failed to fetch profile:", await res.json())
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
    setProfile((prev) => ({ ...prev, [target.name]: target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadProfilePicture = async () => {
    if (!selectedFile) return
    setUploading(true)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const res = await fetch("/api/teacher/upload-profile-picture", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const data = await res.json()
      if (res.ok) {
        setProfile((prev) => ({ ...prev, profile_picture: data.url }))
        setSelectedFile(null)
      }
    } catch (error) {
      console.error("Error uploading picture:", error)
    } finally {
      setUploading(false)
    }
  }

  const saveChanges = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/teacher/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
        credentials: "include",
      })

      if (res.ok) {
        setEditing(false)
        fetchProfile()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const deleteAccount = async () => {
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch("/api/teacher/profile", { method: "DELETE", credentials: "include" })
      if (res.ok) {
        setToast({ message: "Account deleted successfully!", type: "success" })
        setTimeout(() => (window.location.href = "/"), 800)
      } else {
        const j = await res.json().catch(() => null)
        setToast({ message: j?.message || "Error deleting account.", type: "error" })
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      setToast({ message: "Error deleting account.", type: "error" })
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            Teacher Profile
          </h1>
          <p className="text-gray-500 mt-2">Manage your profile information and settings</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Verified Teacher
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <Card className="lg:col-span-1 hover-lift border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-card-foreground">Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="relative inline-block">
              <Avatar className="w-32 h-32 mx-auto border-4 border-border overflow-hidden">
                {profile.profile_picture ? (
                  <AvatarImage
                    src={profile.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.full_name?.charAt(0) || "T"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                <Camera className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="profile-upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                  <Camera className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-500">Choose new photo</span>
                </div>
                <Input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>

              {selectedFile && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>
                  <Button onClick={uploadProfilePicture} disabled={uploading} className="w-full" size="sm">
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      {toast && <CustomAlert message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Profile Information */}
        <Card className="lg:col-span-2 hover-lift border-border bg-stone-200 p-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal and professional details</CardDescription>
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={saveChanges} disabled={saving} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profile.full_name || ""}
                  disabled={!editing}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email || ""}
                  disabled={!editing}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_taught" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Class Taught
                </Label>
                {!editing ? (
                  // Show the human-friendly class name when not editing. If classes haven't loaded or
                  // the stored value doesn't match an id, fall back to the raw value.
                  <Input
                    id="class_taught"
                    name="class_taught"
                    value={
                      (classes.find((c) => c.id === profile.class_taught)?.name as string) ||
                      profile.class_taught ||
                      ""
                    }
                    disabled
                    className="bg-input border-border"
                  />
                ) : (
                  <select
                    aria-label="Class Taught"
                    id="class_taught"
                    name="class_taught"
                    value={profile.class_taught || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-border rounded-md bg-input"
                  >
                    <option value="">Select class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_of_experience" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Years of Experience
                </Label>
                <Input
                  id="years_of_experience"
                  name="years_of_experience"
                  value={profile.years_of_experience || ""}
                  disabled={!editing}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="uin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Unique Identification Number (UIN)
                </Label>
                <Input
                  id="uin"
                  name="uin"
                  value={profile.uin || ""}
                  disabled
                  className="bg-muted cursor-not-allowed border-border"
                />
                <p className="text-xs text-gray-500">Your UIN cannot be changed for security reasons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that will permanently affect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Delete Account</h4>
              <p className="text-sm text-gray-500">
                Permanently delete your teacher account and all associated data
              </p>
            </div>
            <Button onClick={deleteAccount} variant="destructive" size="sm" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
      <ConfirmModal
        open={confirmOpen}
        title="Delete Account"
        description="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )

  // Confirm modal
  // NOTE: JSX above already returned; place modal at end of component by rendering it alongside main return.
  // To keep the structure simple, we will mount modal via a small portalless render when confirmOpen is true.
  // Because Next's app router expects a single return, ensure modal usage is included in the main returned JSX (here we cannot rework entire file layout without large changes).
}


