"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Send, Search, Filter, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Message {
  id: string
  sender: string
  content: string
  timestamp?: string
  read?: boolean
  type?: "student" | "parent" | "admin"
}

export default function TeacherMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/teacher/messages")
        if (res.ok) {
          const data = await res.json()
          // Add mock data for better UI demonstration
          const enhancedData = data.map((msg: Message, index: number) => ({
            ...msg,
            timestamp: new Date(Date.now() - index * 3600000).toISOString(),
            read: Math.random() > 0.3,
            type: ["student", "parent", "admin"][Math.floor(Math.random() * 3)] as "student" | "parent" | "admin",
          }))
          setMessages(enhancedData)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const filteredMessages = messages.filter(
    (msg) =>
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const unreadCount = messages.filter((msg) => !msg.read).length

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "student":
        return "bg-blue-100 text-blue-800"
      case "parent":
        return "bg-green-100 text-green-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const markAsRead = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            Messages
          </h1>
          <p className="text-muted-foreground mt-2">Communicate with students, parents, and administrators</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Search and Filter */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredMessages.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No messages found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "You don't have any messages yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((msg) => (
              <Card
                key={msg.id}
                className={`border-border bg-card hover-lift cursor-pointer transition-all ${
                  !msg.read ? "ring-2 ring-primary/20 bg-primary/5" : ""
                } ${selectedMessage?.id === msg.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => {
                  setSelectedMessage(msg)
                  if (!msg.read) markAsRead(msg.id)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder-40x40.png?height=40&width=40&text=${msg.sender.charAt(0)}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {msg.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${!msg.read ? "text-foreground" : "text-muted-foreground"}`}>
                            {msg.sender}
                          </h4>
                          {msg.type && (
                            <Badge variant="secondary" className={`text-xs ${getMessageTypeColor(msg.type)}`}>
                              {msg.type}
                            </Badge>
                          )}
                        </div>
                        {msg.timestamp && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(msg.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <p className={`text-sm line-clamp-2 ${!msg.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {msg.content}
                      </p>

                      {!msg.read && (
                        <div className="mt-2">
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-1">
          <Card className="border-border bg-card sticky top-4">
            {selectedMessage ? (
              <>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/placeholder-icon.png?height=48&width=48&text=${selectedMessage.sender.charAt(0)}`}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedMessage.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-card-foreground">{selectedMessage.sender}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {selectedMessage.type && (
                          <Badge variant="secondary" className={`text-xs ${getMessageTypeColor(selectedMessage.type)}`}>
                            {selectedMessage.type}
                          </Badge>
                        )}
                        {selectedMessage.timestamp && (
                          <span className="text-xs">{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-foreground whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                  <Button className="w-full flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Reply
                  </Button>
                </CardContent>
              </>
            ) : (
              <CardContent className="text-center py-12">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a message to view details</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
