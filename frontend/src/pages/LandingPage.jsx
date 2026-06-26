import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, RefreshCw, Layers, Layout, ArrowRight, Zap, Terminal, Code2, ChevronDown, Copy, CheckCircle2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-brand selection:text-white dark:selection:text-[#050505] relative overflow-hidden font-sans transition-colors duration-300">
      {/* Ambient glowing background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#050505]/70 backdrop-blur-xl border-b border-black/10 dark:border-border/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand/10 border border-brand/20 shadow-glow-orange">
              <Zap className="h-6 w-6 text-brand" />
            </div>
            <span className="hidden md:block text-base sm:text-xl font-display font-bold tracking-widest uppercase whitespace-nowrap">
              MailZap
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/login" className="hidden md:block text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white text-sm font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
              Sign In
            </Link>
            <Link to="/register" className="hidden md:flex bg-brand/10 border border-brand/30 hover:bg-brand/20 hover:border-brand text-brand px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-widest transition-all shadow-glow-orange group items-center gap-1 sm:gap-2 whitespace-nowrap">
              <span className="hidden sm:inline">Get Started Free</span>
              <span className="sm:hidden">Get Started</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 rounded-full px-5 py-2 text-xs font-mono uppercase tracking-widest text-brand mb-8 backdrop-blur-sm shadow-glow-orange animate-pulse">
            <span className="h-2 w-2 rounded-full bg-brand"></span> Introducing Smart Context Editing
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter max-w-5xl mx-auto leading-[1.1] mb-8 text-gray-900 dark:text-white">
            Write Production-Grade<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-accent to-brand">
              Emails
            </span>
          </h1>
          <p className="text-gray-600 dark:text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
            Generate polished, context-specific emails, adjust tone dynamically, and optimize content instantly. Complete control, zero writer's block.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl">
            <Link to="/register" className="w-full sm:w-auto flex-1 whitespace-nowrap flex items-center justify-center gap-3 bg-brand text-black px-8 py-4 rounded-xl text-lg font-display font-bold uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,87,34,0.4)] hover:shadow-[0_0_50px_rgba(255,87,34,0.6)] hover:scale-[1.02]">
              Start Writing Free <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto flex-1 whitespace-nowrap flex items-center justify-center gap-3 bg-transparent border border-black/20 dark:border-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-xl text-lg font-display font-bold uppercase tracking-widest transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/40 dark:hover:border-white/40">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Screen Mockup Placeholder */}
      <section className="pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-xl p-2 shadow-glass overflow-hidden group hover:border-brand/30 transition-colors duration-700">
          <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="h-[400px] md:h-[600px] rounded-xl bg-gray-50 dark:bg-[#050505] border border-black/5 dark:border-white/5 flex flex-col overflow-hidden relative z-10 transition-colors duration-300">
            <div className="h-12 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 flex items-center justify-between transition-colors duration-300">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-500 dark:text-text-secondary font-mono tracking-widest uppercase">mailzap-workspace.app</span>
              <div className="w-16"></div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,rgba(255,87,34,0.05),transparent_70%)]">
              <div className="text-center">
                <Layout className="h-16 w-16 text-brand mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Interactive Workspace Dashboard</h3>
                <p className="text-gray-500 dark:text-text-secondary max-w-md mx-auto text-sm transition-colors duration-300">
                  Here you will generate professional emails with custom tones, preview outputs, and tweak drafts instantly using generative AI controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-black/10 dark:border-border/50 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Supercharge Your Email Workflow</h2>
            <p className="text-gray-600 dark:text-text-secondary transition-colors duration-300">Everything you need to write professional templates, customize tone, translate languages, and maintain clean histories.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md p-8 rounded-2xl hover:border-brand/40 dark:hover:border-brand/40 transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-brand/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <Sparkles className="h-10 w-10 text-brand mb-6 relative z-10" />
              <h3 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-white relative z-10 transition-colors duration-300">AI Generated Outputs</h3>
              <p className="text-gray-600 dark:text-text-secondary text-sm leading-relaxed relative z-10 transition-colors duration-300">Leverage state-of-the-art LLM prompts optimized specifically for drafting high-converting corporate outreach or requests.</p>
            </div>
            <div className="border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md p-8 rounded-2xl hover:border-accent/40 dark:hover:border-accent/40 transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <RefreshCw className="h-10 w-10 text-accent mb-6 relative z-10" />
              <h3 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-white relative z-10 transition-colors duration-300">Instant AI Actions</h3>
              <p className="text-gray-600 dark:text-text-secondary text-sm leading-relaxed relative z-10 transition-colors duration-300">Shorten, expand, adjust tones, fix grammar, or translate text. Edit outputs on the fly without copy-pasting back and forth.</p>
            </div>
            <div className="border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md p-8 rounded-2xl hover:border-brand/40 dark:hover:border-brand/40 transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-brand/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <Layers className="h-10 w-10 text-brand mb-6 relative z-10" />
              <h3 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-white relative z-10 transition-colors duration-300">Predefined Libraries</h3>
              <p className="text-gray-600 dark:text-text-secondary text-sm leading-relaxed relative z-10 transition-colors duration-300">Access built-in prompt categories (HR, Business, Education) or save and manage custom templates for quick reuse.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 border-t border-black/10 dark:border-border/50 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-gray-900 dark:text-white transition-colors duration-300">How It Works</h2>
            <p className="text-gray-600 dark:text-text-secondary transition-colors duration-300">Generate and save highly effective email drafts in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-brand/50 bg-brand/10 text-brand font-display font-bold text-2xl flex items-center justify-center mb-6 shadow-glow-orange">1</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Select Purpose & Settings</h3>
              <p className="text-gray-600 dark:text-text-secondary text-sm transition-colors duration-300">Choose from prompt libraries or input custom criteria defining recipient, tone, and language.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-brand/50 bg-brand/10 text-brand font-display font-bold text-2xl flex items-center justify-center mb-6 shadow-glow-orange">2</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Preview & Tweak</h3>
              <p className="text-gray-600 dark:text-text-secondary text-sm transition-colors duration-300">Review output details and execute editing filters (Translate, Simplify, Shorten, etc.).</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-brand/50 bg-brand/10 text-brand font-display font-bold text-2xl flex items-center justify-center mb-6 shadow-glow-orange">3</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Copy or Save</h3>
              <p className="text-gray-600 dark:text-text-secondary text-sm transition-colors duration-300">Download as PDF or save directly to history for easily searching previous outputs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 border-t border-black/10 dark:border-border/50 relative transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <div className="border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md p-6 rounded-2xl transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 transition-colors duration-300"><CheckCircle2 className="h-5 w-5 text-brand" /> Does this app send emails?</h3>
              <p className="text-gray-600 dark:text-text-secondary text-sm leading-relaxed pl-7 transition-colors duration-300">No, this is an AI email content generator. It focuses on writing and polishing drafts which you can easily copy and send via your own provider.</p>
            </div>
            <div className="border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md p-6 rounded-2xl transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 transition-colors duration-300"><CheckCircle2 className="h-5 w-5 text-brand" /> Are my generated templates saved?</h3>
              <p className="text-gray-600 dark:text-text-secondary text-sm leading-relaxed pl-7 transition-colors duration-300">Yes, you can create and save custom templates, mark generated emails as favorites, and search previous items from history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 border-t border-black/10 dark:border-border/50 relative overflow-hidden text-center transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,87,34,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-gray-900 dark:text-white transition-colors duration-300">Ready to Eliminate Writer's Block?</h2>
          <Link to="/register" className="inline-flex items-center gap-3 bg-brand text-black px-10 py-5 rounded-xl text-lg font-display font-bold transition-all shadow-[0_0_30px_rgba(255,87,34,0.4)] hover:shadow-[0_0_50px_rgba(255,87,34,0.6)] hover:scale-[1.02]">
            Start Writing Free <Sparkles className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-border/50 py-12 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-brand" />
            <span className="font-display font-bold tracking-widest uppercase text-gray-900 dark:text-white transition-colors duration-300">MailZap</span>
          </div>
          <div className="text-xs font-mono text-gray-500 dark:text-text-secondary uppercase tracking-widest transition-colors duration-300">© {new Date().getFullYear()} MailZap. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
