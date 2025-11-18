'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const TASK_TYPES = ['Development', 'Design', 'QA', 'Documentation', 'Research']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
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
    priority: PRIORITIES[1],
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '17:00',
    skills: [] as string[]
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description || formData.skills.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    onAddTask({
      ...formData,
      createdAt: new Date().toISOString()
    })

    // Reset form
    setFormData({
      name: '',
      type: TASK_TYPES[0],
      description: '',
      duration: '4',
      priority: PRIORITIES[1],
      startDate: '',
      startTime: '09:00',
      endDate: '',
      endTime: '17:00',
      skills: []
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
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
          <Label htmlFor="startDate" className="text-sm font-semibold text-foreground">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="mt-2 rounded-lg border border-border bg-background"
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
          <Label htmlFor="endDate" className="text-sm font-semibold text-foreground">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="mt-2 rounded-lg border border-border bg-background"
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

      {/* Skills Multi-Select */}
      <div>
        <Label className="text-sm font-semibold text-foreground">Required Skills *</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {SKILLS.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                formData.skills.includes(skill)
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-background text-foreground hover:border-foreground/50'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base font-medium rounded-lg"
      >
        Add to Queue
      </Button>
    </form>
  )
}
