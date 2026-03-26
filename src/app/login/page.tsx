'use client';

import { Github, Mail } from 'lucide-react';
// We use the existing client you made earlier for the frontend
import { supabase } from '@/lib/supabase'; 

export default function LoginPage() {
  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // This tells Supabase where to send the user after they log in
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-slate-500">Sign in to manage your AI portfolios.</p>

        <div className="space-y-3 pt-4">
          <button 
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white py-3 rounded-xl font-medium hover:bg-zinc-800 transition-all"
          >
            <Github size={20} /> Continue with GitHub
          </button>
          
          <button 
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-300 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all"
          >
            <Mail size={20} /> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
