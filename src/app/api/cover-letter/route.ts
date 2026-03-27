import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { username, jobDescription } = await req.json();

    // 1. Check Auth & Fetch Resume Data
    // We check user_id to ensure hackers can't generate letters using other people's resumes!
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('data')
      .eq('username', username)
      .eq('user_id', user.id)
      .single();

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // 2. Prompt Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are an expert career coach and executive copywriter. 
    Your task is to write a highly professional, engaging, and persuasive cover letter for the following job description:
    
    JOB DESCRIPTION:
    "${jobDescription}"

    Use the candidate's parsed resume data below to highlight relevant skills and prove they are a perfect fit.
    Do not invent or lie about experience. Only use facts from the resume data.
    
    RESUME DATA:
    ${JSON.stringify(portfolio.data)}

    Format the output as a clean, ready-to-copy cover letter. Do not include placeholder brackets like [Your Address] or [Date], just jump straight into "Dear Hiring Manager,".`;

    const result = await model.generateContent(prompt);
    const coverLetterText = result.response.text();

    return NextResponse.json({ coverLetter: coverLetterText }, { status: 200 });

  } catch (error) {
    console.error("Cover Letter error:", error);
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}