'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 
import { useRouter } from 'next/navigation';

export default function DeleteButton({ username }: { username: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // 1. Double check with the user
    if (!window.confirm("Are you sure you want to delete this portfolio? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    // 2. Tell Supabase to delete this specific row
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('username', username);

    if (error) {
      alert("Failed to delete portfolio.");
      console.error(error);
      setIsDeleting(false);
    } else {
      // 3. Force the dashboard to refresh and hide the deleted card
      router.refresh(); 
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Portfolio"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}