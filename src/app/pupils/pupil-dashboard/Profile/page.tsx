"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { FaUserEdit, FaCamera, FaSave, FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function PupilProfile() {
  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    email: "",
    class: "",
    uin: "",
    profile_picture: "",
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/pupils/details?self=1", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(() => ({ ...data }))
      }
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
      const res = await fetch("/api/pupils/upload-profile-picture", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setProfile((prev) => ({ ...prev, profile_picture: data.url }))
        setSelectedFile(null)
      }
    } catch {
      // handle error
    } finally {
      setUploading(false)
    }
  }

  const saveChanges = async () => {
    try {
      const res = await fetch("/api/pupils/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setEditing(false)
        fetchProfile()
      }
    } catch {
      // handle error
    }
  }

  const changePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.")
      return
    }
    try {
      const res = await fetch("/api/pupils/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uin: profile.uin, oldPassword: password, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setPasswordMsg("Password changed successfully!")
        setPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordMsg(data.error || "Failed to change password.")
      }
    } catch {
      setPasswordMsg("Failed to change password.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <FaUser className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>
        </div>

        {/* Profile Information Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <FaUserEdit className="text-blue-500" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>Update your profile details and manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-2">
                <Avatar className="w-24 h-24 border-4 border-blue-100">
                {profile.profile_picture ? (
                  <AvatarImage
                  src={profile.profile_picture}
                  alt="Profile picture"
                  className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white text-xl">
                  {profile.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                )}
                </Avatar>

              <div className="flex flex-col space-y-3">
                <Label htmlFor="profile-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <FaCamera className="text-blue-500" />
                    <span className="text-blue-600 font-medium">Change Picture</span>
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
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{selectedFile.name}</span>
                    <Button
                      onClick={uploadProfilePicture}
                      disabled={uploading}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profile.full_name || ""}
                  disabled={!editing}
                  onChange={handleChange}
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  name="class"
                  value={profile.class || ""}
                  disabled={!editing}
                  onChange={handleChange}
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uin">Student ID (UIN)</Label>
                <Input id="uin" name="uin" value={profile.uin || ""} disabled className="bg-gray-50" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 p-2">
              {editing ? (
                <>
                  <Button onClick={saveChanges} className="bg-blue-500 hover:bg-blue-600">
                    <FaSave className="mr-2 w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="outline" className="border-gray-300">
                    <FaTimes className="mr-2 w-4 h-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)} className="bg-amber-500 hover:bg-amber-600">
                  <FaUserEdit className="mr-2 w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card className="shadow-lg border-0 p-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <FaLock className="text-red-500" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription>Update your account password for better security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {passwordMsg && (
              <Alert
                className={
                  passwordMsg.includes("successfully") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }
              >
                <AlertDescription className={passwordMsg.includes("successfully") ? "text-green-700" : "text-red-700"}>
                  {passwordMsg}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={changePassword}
              className="bg-green-500 hover:bg-green-600"
              disabled={!password || !newPassword || !confirmPassword}
            >
              <FaLock className="mr-2 w-4 h-4" />
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
