import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './SignOutButton';
import { Sparkles, LayoutDashboard } from 'lucide-react';

export default async function Navbar() {
  const supabase = await createClient();
  
  // Securely check if the user is logged in right now
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 transition-opacity hover:opacity-80">
          <Sparkles className="text-purple-600" size={24} />
          ResumeStream
        </Link>

        {/* Right Side: Auth & Navigation Logic */}
        <div className="flex items-center gap-6">
          
          {user ? (
            /* --- IF USER IS SIGNED IN --- */
            <>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              
              <div className="w-px h-4 bg-slate-300" /> {/* Little dividing line */}
              
              <SignOutButton />
            </>
          ) : (
            /* --- IF USER IS NOT SIGNED IN --- */
            <Link 
              href="/login" 
              className="text-sm font-medium bg-zinc-900 text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              Sign In
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}