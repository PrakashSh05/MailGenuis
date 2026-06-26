import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sparkles, Shield, RefreshCw, Layers, Layout, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-primary text-editorial-primary selection:bg-brand-500 selection:text-editorial-primary">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-warm-primary/80 backdrop-blur-md border-b border-editorial-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-brand-500" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
              MailGenius AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-editorial-secondary hover:text-editorial-primary text-sm font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="bg-brand-600 hover:bg-brand-500 text-editorial-primary px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-brand-950/50 hover:scale-[1.02] active:scale-[0.98]">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#1e293b,transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-950/60 border border-brand-800/40 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-400 mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Introducing Next-Gen Email Writing
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Write Production-Grade Emails <br/>
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-indigo-500 bg-clip-text text-transparent">
              Powered by Google Gemini
            </span>
          </h1>
          <p className="text-editorial-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Generate polished, context-specific emails, adjust tone dynamically, and optimize content instantly. Complete control, zero writer's block.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-editorial-primary px-8 py-4 rounded-xl text-base font-bold transition-all shadow-lg shadow-brand-900/30 hover:scale-[1.02] active:scale-[0.98]">
              Start Writing Free <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 border border-editorial-border hover:border-slate-600 bg-black/30 hover:bg-slate-800 text-editorial-secondary hover:text-editorial-primary px-8 py-4 rounded-xl text-base font-semibold transition-all">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Screen Mockup Placeholder */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl border border-editorial-border bg-warm-secondary p-4 shadow-2xl shadow-slate-950/80">
          <div className="absolute -top-12 -left-12 h-64 w-64 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="h-[300px] md:h-[450px] rounded-lg bg-warm-primary border border-editorial-border flex flex-col overflow-hidden relative">
            <div className="h-10 border-b border-editorial-border bg-warm-secondary/60 px-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-editorial-secondary ml-4 font-mono">mailgenius-workspace.app</span>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Layout className="h-16 w-16 text-editorial-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-editorial-secondary">Interactive Workspace Dashboard</h3>
                <p className="text-editorial-secondary max-w-md mx-auto text-sm mt-1">
                  Here you will generate professional emails with custom tones, preview outputs, and tweak drafts instantly using generative AI controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-editorial-border relative bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Email Workflow</h2>
            <p className="text-editorial-secondary">Everything you need to write professional templates, customize tone, translate languages, and maintain clean histories.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-editorial-border/80 bg-warm-secondary/40 p-8 rounded-2xl">
              <Sparkles className="h-10 w-10 text-brand-500 mb-6" />
              <h3 className="text-xl font-bold mb-2">Gemini Generated Outputs</h3>
              <p className="text-editorial-secondary text-sm leading-relaxed">Leverage state-of-the-art LLM prompts optimized specifically for drafting high-converting corporate outreach or requests.</p>
            </div>
            <div className="border border-editorial-border/80 bg-warm-secondary/40 p-8 rounded-2xl">
              <RefreshCw className="h-10 w-10 text-brand-500 mb-6" />
              <h3 className="text-xl font-bold mb-2">Instant AI Actions</h3>
              <p className="text-editorial-secondary text-sm leading-relaxed">Shorten, expand, adjust tones, fix grammar, or translate text. Edit outputs on the fly without copy-pasting back and forth.</p>
            </div>
            <div className="border border-editorial-border/80 bg-warm-secondary/40 p-8 rounded-2xl">
              <Layers className="h-10 w-10 text-brand-500 mb-6" />
              <h3 className="text-xl font-bold mb-2">Predefined Libraries</h3>
              <p className="text-editorial-secondary text-sm leading-relaxed">Access built-in prompt categories (HR, Business, Education) or save and manage custom templates for quick reuse.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stepper / How it Works */}
      <section className="py-24 border-t border-editorial-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-editorial-secondary">Generate and save highly effective email drafts in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-brand-900/40 border border-brand-500 text-brand-400 text-lg font-bold flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Select Purpose & Settings</h3>
              <p className="text-editorial-secondary text-sm">Choose from prompt libraries or input custom criteria defining recipient, tone, and language.</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-brand-900/40 border border-brand-500 text-brand-400 text-lg font-bold flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">Preview & Tweak</h3>
              <p className="text-editorial-secondary text-sm">Review output details and execute AI editing filters (Translate, Simplify, Shorten, etc.).</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-brand-900/40 border border-brand-500 text-brand-400 text-lg font-bold flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">Copy or Save</h3>
              <p className="text-editorial-secondary text-sm">Download as PDF or save directly to history for easily searching previous outputs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-editorial-border bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border border-editorial-border bg-warm-secondary/40 p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-2">Does this app send emails?</h4>
              <p className="text-editorial-secondary text-sm">No, this is an AI email content generator. It focuses on writing and polishing drafts which you can easily copy and send via your own provider.</p>
            </div>
            <div className="border border-editorial-border bg-warm-secondary/40 p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-2">Are my generated templates saved?</h4>
              <p className="text-editorial-secondary text-sm">Yes, you can create and save custom templates, mark generated emails as favorites, and search previous items from history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 border-t border-editorial-border relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-extrabold mb-6">Ready to Eliminate Writer's Block?</h2>
          <p className="text-editorial-secondary max-w-xl mx-auto mb-8">Create your free account today and experience lightning-fast email composition powered by advanced AI.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-editorial-primary px-8 py-4 rounded-xl text-base font-bold transition-all shadow-lg shadow-brand-900/30 hover:scale-[1.02] active:scale-[0.98]">
            Get Started For Free <Sparkles className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-editorial-border py-12 text-editorial-secondary text-center text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-brand-500" />
            <span className="font-bold text-editorial-secondary">MailGenius AI</span>
          </div>
          <div>© {new Date().getFullYear()} MailGenius AI. All rights reserved. Built with Spring Boot & React.</div>
        </div>
      </footer>
    </div>
  );
}
