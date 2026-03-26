'use client';

import { supabase } from '@/lib/supabase';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {

  const handleSignOut = async () => {
    // 1. Tell Supabase to destroy the session cookie
    await supabase.auth.signOut();
    
    // 2. Force a hard browser navigation to the home page.
    // This completely wipes the Next.js frontend cache and forces 
    // the Server Components (like the Navbar) to re-render from scratch!
    window.location.href = '/'; 
  };

  return (
    <button 
      onClick={handleSignOut}
      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}