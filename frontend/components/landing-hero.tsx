'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Users, Calendar, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LandingHero() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Dynamic Staffing</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Match the Right People
              <br />
              <span className="text-primary">to the Right Tasks</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Intelligently schedule your workforce using AI-powered analysis. 
              Match employee skills to task requirements, optimize schedules, and maximize productivity.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => router.push('/intake')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Matching</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI analyzes task complexity and matches employees using semantic search
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Optimize schedules based on priority, deadlines, and resource availability
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Get instant recommendations and insights to improve team efficiency
              </p>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="mt-16 p-8 rounded-lg border border-border bg-card">
            <h3 className="font-semibold text-lg mb-6">How It Works</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h4 className="font-medium mb-2">Upload Data</h4>
                <p className="text-sm text-muted-foreground">Employee profiles & historical tasks</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h4 className="font-medium mb-2">Create Tasks</h4>
                <p className="text-sm text-muted-foreground">Define requirements & priorities</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h4 className="font-medium mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">Smart matching & optimization</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h4 className="font-medium mb-2">Review & Approve</h4>
                <p className="text-sm text-muted-foreground">Finalize optimized schedule</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

