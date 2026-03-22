import { supabase } from '@/lib/supabase';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import { notFound } from 'next/navigation';

// Next.js 15+ requires params to be treated as a Promise
export default async function UserPortfolioPage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  // 1. Await the params to get the actual username from the URL
  const resolvedParams = await params;
  const username = resolvedParams.username;

  // 2. Fetch the portfolio data using the resolved username
  const { data, error } = await supabase
    .from('portfolios')
    .select('data')
    .eq('username', username)
    .single();

  // 3. If no user is found, show the 404 page
  if (error || !data) {
    notFound();
  }

  // 4. If found, render the template!
  return <PortfolioTemplate data={data.data} />;
}