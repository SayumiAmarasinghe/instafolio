'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, Sparkles, Layout, FileText } from 'lucide-react';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import { ResumeData } from '@/types';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<ResumeData | null>(null);
  
  const [themePrompt, setThemePrompt] = useState('');
  const [username, setUsername] = useState('');
  
  // 1. New State to track the user's goal
  const [actionType, setActionType] = useState<'portfolio' | 'coverLetter'>('portfolio');

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!username) {
      e.preventDefault(); 
      alert("Please claim your unique URL (username) first!");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    
    // Sanitize username
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    formData.append('username', cleanUsername);
    
    // Only send the theme prompt if they are actually building a portfolio
    if (actionType === 'portfolio') {
      formData.append('themePrompt', themePrompt || 'Clean, modern, and professional light mode');
    }

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
      
      // 2. Dynamic Redirect Logic based on what they selected!
      if (data.success) {
        if (actionType === 'coverLetter') {
          // Send them straight to the cover letter tool
          window.location.href = `/dashboard/cover-letter/${cleanUsername}`;
        } else if (data.redirectUrl) {
          // Standard portfolio redirect
          window.location.href = data.redirectUrl;
        }
      }

    } catch (error: any) {
      console.error("Error generating data:", error);
      alert(error.message || "Failed to parse resume. Please try again.");
    } finally {
      setLoading(false);
      e.target.value = ''; 
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
          Upload your static PDF resume. We'll extract your data and generate a beautiful, hosted portfolio or custom cover letter in seconds.
        </p>

        <div className="mt-8 max-w-md mx-auto space-y-4 text-left">
          
          {/* URL Claim Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Claim your unique URL
            </label>
            <div className="flex shadow-sm rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
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

          {/* 3. The New Goal Selector Toggle */}
          <div className="pt-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              What do you want to create?
            </label>
            <div className="flex bg-slate-200/50 p-1 rounded-xl">
              <button
                onClick={() => setActionType('portfolio')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  actionType === 'portfolio' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Layout size={16} /> Portfolio Website
              </button>
              <button
                onClick={() => setActionType('coverLetter')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  actionType === 'coverLetter' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileText size={16} /> Targeted Cover Letter
              </button>
            </div>
          </div>

          {/* Conditionally hide the theme prompt if they only want a cover letter */}
          {actionType === 'portfolio' && (
            <div className="pt-2 relative transition-all">
              <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">
                Describe your dream website theme (Optional)
              </label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-3 text-purple-500" size={18} />
                <input 
                  type="text"
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  placeholder="e.g. 'Retro 80s arcade', 'Dark mode hacker'"
                  className="w-full text-slate-600 pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Upload Box */}
        <div className="mt-6 border-2 border-dashed border-purple-200 bg-white rounded-2xl p-12 transition-all hover:border-purple-500 hover:bg-purple-50/50">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-purple-600">
              <Loader2 className="animate-spin" size={48} />
              <p className="font-medium animate-pulse">
                {actionType === 'portfolio' ? 'Designing your custom theme...' : 'Analyzing your resume...'}
              </p>
            </div>
          ) : (
            <label className="flex flex-col items-center cursor-pointer gap-4">
              <UploadCloud size={48} className="text-purple-500" />
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-700">Click to upload your Resume PDF</p>
                <p className="text-sm text-slate-500">Max file size 5MB.</p>
              </div>
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                onClick={handleInputClick}
                onChange={handleFileUpload} 
              />
            </label>
          )}
        </div>
      </div>
    </main>
  );
}