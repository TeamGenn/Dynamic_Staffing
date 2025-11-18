'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTask, type TaskCreateRequest } from '@/lib/api'

const TASK_TYPES = ['Development', 'Design', 'QA', 'Documentation', 'Research']
const PRIORITY_MAP: Record<string, number> = {
  'Low': 1,
  'Medium': 2,
  'High': 4,
  'Critical': 5
}
const SKILLS = [
  'React', 'TypeScript', 'Node.js', 'UI/UX', 'Testing',
  'DevOps', 'Database', 'Python', 'API Design', 'Project Management'
]

interface TaskCreationFormProps {
  onAddTask: (task: any) => void
}

export function TaskCreationForm({ onAddTask }: TaskCreationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: TASK_TYPES[0],
    description: '',
    duration: '4',
    priority: 'Medium',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '17:00',
    skills: {} as Record<string, number>
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      const newSkills = { ...prev.skills }
      if (newSkills[skill]) {
        delete newSkills[skill]
      } else {
        newSkills[skill] = 5 // Default skill level
      }
      return { ...prev, skills: newSkills }
    })
    setError(null)
  }

  const setSkillLevel = (skill: string, level: number) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: level }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name || !formData.description || Object.keys(formData.skills).length === 0) {
      setError('Please fill in all required fields')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Please provide both start and end dates')
      return
    }

    // Combine date and time into ISO datetime strings
    const startDatetime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString()
    const endDatetime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString()

    if (new Date(endDatetime) <= new Date(startDatetime)) {
      setError('End date/time must be after start date/time')
      return
    }

    // Convert duration from hours to minutes
    const durationMinutes = parseInt(formData.duration) * 60

    // Map priority string to number
    const priorityNumber = PRIORITY_MAP[formData.priority] || 2

    setIsSubmitting(true)

    try {
      // Create task payload matching backend schema
      const taskPayload: TaskCreateRequest = {
        task_type: formData.type,
        duration_minutes: durationMinutes,
        required_skills: formData.skills,
        priority: priorityNumber,
        start_datetime: startDatetime,
        end_datetime: endDatetime
      }

      // Call API to create task
      const response = await createTask(taskPayload)

      // Call parent callback with task data
      onAddTask({
        task_id: response.task_id,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        duration: formData.duration,
        priority: formData.priority,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        skills: formData.skills,
        createdAt: new Date().toISOString()
      })

      // Reset form
      setFormData({
        name: '',
        type: TASK_TYPES[0],
        description: '',
        duration: '4',
        priority: 'Medium',
        startDate: '',
        startTime: '09:00',
        endDate: '',
        endTime: '17:00',
        skills: {}
      })
    } catch (err: any) {
      setError(err.message || 'Failed to create task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Task Name */}
      <div>
        <Label htmlFor="name" className="text-sm font-semibold text-foreground">Task Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="e.g., Build user dashboard"
          className="mt-2 rounded-lg border border-border bg-background"
        />
      </div>

      {/* Type and Priority */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="type" className="text-sm font-semibold text-foreground">Task Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          >
            {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <Label htmlFor="priority" className="text-sm font-semibold text-foreground">Priority</Label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          >
            {Object.keys(PRIORITY_MAP).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description *</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Detailed task description..."
          rows={3}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        />
      </div>

      {/* Duration */}
      <div>
        <Label htmlFor="duration" className="text-sm font-semibold text-foreground">Duration (hours)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          value={formData.duration}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          className="mt-2 rounded-lg border border-border bg-background"
        />
      </div>

      {/* Date and Time Range */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="startDate" className="text-sm font-semibold text-foreground">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="mt-2 rounded-lg border border-border bg-background"
            required
          />
        </div>

        <div>
          <Label htmlFor="startTime" className="text-sm font-semibold text-foreground">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className="mt-2 rounded-lg border border-border bg-background"
          />
        </div>

        <div>
          <Label htmlFor="endDate" className="text-sm font-semibold text-foreground">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="mt-2 rounded-lg border border-border bg-background"
            required
          />
        </div>

        <div>
          <Label htmlFor="endTime" className="text-sm font-semibold text-foreground">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className="mt-2 rounded-lg border border-border bg-background"
          />
        </div>
      </div>

      {/* Skills Multi-Select with Levels */}
      <div>
        <Label className="text-sm font-semibold text-foreground">Required Skills * (Click to add, set level 1-10)</Label>
        <div className="mt-3 space-y-3">
          {SKILLS.map(skill => {
            const isSelected = skill in formData.skills
            const level = formData.skills[skill] || 5

            return (
              <div key={skill} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background text-foreground hover:border-foreground/50'
                  }`}
                >
                  {skill}
                </button>
                {isSelected && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`skill-${skill}`} className="text-xs text-muted-foreground">Level:</Label>
                    <Input
                      id={`skill-${skill}`}
                      type="number"
                      min="1"
                      max="10"
                      value={level}
                      onChange={(e) => setSkillLevel(skill, parseInt(e.target.value) || 1)}
                      className="w-20 rounded-lg border border-border bg-background"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {Object.keys(formData.skills).length === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">Select at least one skill</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-medium rounded-lg"
      >
        {isSubmitting ? 'Creating Task...' : 'Add to Queue'}
      </Button>
    </form>
  )
}
