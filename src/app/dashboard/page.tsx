import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, PlusCircle, FileText } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Check if the user is actually logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Kick them to the login page if they aren't authenticated
    redirect('/login');
  }

  // 2. Fetch ONLY the portfolios owned by this user
  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('username, created_at, data')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-slate-900">Your Dashboard</h1>
          <Link href="/" className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-all font-medium">
            <PlusCircle size={20} /> New Portfolio
          </Link>
        </div>

        {portfolios?.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl border border-slate-200">
            <p className="text-slate-500 mb-4">You haven't generated any portfolios yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios?.map((site) => (
              <div key={site.username} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{site.data?.name || 'Untitled'}</h3>
                    <p className="text-sm text-slate-500">/{site.username}</p>
                  </div>
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: site.data?.themeColors?.primary || '#3b82f6' }} />
                </div>
                
                <Link 
                  href={`/${site.username}`} 
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 font-medium text-sm"
                >
                  <ExternalLink size={16} /> View Live Site
                </Link>
                {/*Cover Letter Button */}
                <Link 
                    href={`/dashboard/cover-letter/${site.username}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-600 border border-purple-200 py-2 rounded-lg hover:bg-purple-100 font-medium text-sm transition-colors"
                  >
                    <FileText size={16} /> Write Cover Letter
                  </Link>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}