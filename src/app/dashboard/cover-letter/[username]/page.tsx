'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Loader2, ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CoverLetterGenerator() {
  const params = useParams();
  const username = params.username as string;
  
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLetter = async () => {
    if (!jobDescription) return alert("Please paste a job description first!");
    
    setLoading(true);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, jobDescription }),
      });
      
      const data = await res.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
      } else {
        alert("Failed to generate cover letter.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
          <FileText className="text-purple-600" /> Targeted Cover Letter
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Paste the Job Description
            </label>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g., We are looking for a Software Engineer with React and Node.js experience..."
              className="w-full h-64 p-4 rounded-xl border text-slate-700 border-slate-200 focus:ring-2 focus:ring-purple-600 outline-none resize-none"
            />
            <button 
              onClick={generateLetter}
              disabled={loading}
              className="w-full bg-purple-600 text-white font-medium py-3 rounded-xl hover:bg-purple-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
              {loading ? 'Analyzing & Writing...' : 'Generate Letter'}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-slate-700">AI Generated Result</label>
              {coverLetter && (
                <button 
                  onClick={copyToClipboard}
                  className="text-sm flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-6 overflow-y-auto min-h-[16rem] whitespace-pre-wrap text-slate-700 leading-relaxed">
              {coverLetter || <span className="text-slate-400 italic">Your targeted cover letter will appear here...</span>}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}