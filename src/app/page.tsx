'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, Sparkles } from 'lucide-react';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import { ResumeData } from '@/types';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<ResumeData | null>(null);
  
  // 1. Change state to a text string
  const [themePrompt, setThemePrompt] = useState('');

  const [username, setUsername] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    if (!username) {
    alert("Please enter a username first!");
    e.target.value = '';
    return;
  }
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('username', username.toLowerCase().replace(/[^a-z0-9]/g, '')); // Sanitize to URL-safe format
    
    // 2. Append the user's typed prompt, or a default if they leave it blank
    formData.append('themePrompt', themePrompt || 'Clean, modern, and professional light mode');

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: Did not return JSON. Check your terminal for the backend crash log.");
      }
      
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to parse resume.");
      }

      setPortfolioData(data);
     if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }

    } catch (error: any) {
      console.error("Error generating portfolio:", error);
      alert(error.message || "Failed to parse resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (portfolioData) {
    return <PortfolioTemplate data={portfolioData} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Resume to <span className="text-purple-600">Live Portfolio</span>
        </h1>
        <p className="text-lg text-slate-600">
          Upload your static PDF resume. We'll extract your data and generate a beautiful, hosted portfolio in seconds.
        </p>

        {/* 3. The Custom Theme Text Input */}
        <div className="mt-8 max-w-md mx-auto space-y-4 text-left">
          
          {/* URL Claim Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Claim your unique URL
            </label>
            <div className="flex shadow-sm rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <span className="bg-slate-100 text-slate-500 px-4 py-3 border-r border-slate-300 font-mono text-sm flex items-center">
                resumestream.app/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="w-full px-4 py-3 outline-none text-slate-500"
              />
            </div>
          </div>
          </div>
          
          {/* ... Your existing Theme Prompt input goes here ... */}
        <div className="mt-8 max-w-md mx-auto relative">
          <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">
            Describe your dream website theme (Optional)
          </label>
          <div className="relative">
            <Sparkles className="absolute left-3 top-3 text-purple-500" size={18} />
            <input 
              type="text"
              value={themePrompt}
              onChange={(e) => setThemePrompt(e.target.value)}
              placeholder="e.g. 'Retro 80s arcade', 'Dark mode hacker', 'Ocean vibes'"
              className="w-full text-slate-400 pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="mt-6 border-2 border-dashed border-purple-200 bg-white rounded-2xl p-12 transition-all hover:border-purple-500 hover:bg-purple-50/50">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-purple-600">
              <Loader2 className="animate-spin" size={48} />
              <p className="font-medium animate-pulse">Designing your custom theme...</p>
            </div>
          ) : (
            <label className="flex flex-col items-center cursor-pointer gap-4">
              <UploadCloud size={48} className="text-purple-500" />
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-700">Click to upload your Resume PDF</p>
                <p className="text-sm text-slate-500">Max file size 5MB.</p>
              </div>
              <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
        </div>
      </div>
    </main>
  );
}