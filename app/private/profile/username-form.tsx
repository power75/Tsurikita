'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X } from "lucide-react"
import { updateUsername } from './actions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UsernameFormProps {
  initialUsername: string | null
}

export function UsernameForm({ initialUsername }: UsernameFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(initialUsername || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await updateUsername(formData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="新しいユーザー名"
          className="w-48"
          required
        />
        <Button type="submit" variant="default" size="sm" className="cursor-pointer">
          <Check className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => {
            setIsEditing(false)
            setUsername(initialUsername || '')
          }}
          className="cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      </form>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>ユーザー名を編集</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 