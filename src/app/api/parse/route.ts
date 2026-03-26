import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractText } from 'unpdf';
// Import the server-side Supabase client to access secure auth cookies
import { createClient } from '@/lib/supabase/server'; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    const themePrompt = formData.get('themePrompt') as string;
    const username = formData.get('username') as string;

    if (!file || !username) {
      return NextResponse.json({ error: 'Missing file or username' }, { status: 400 });
    }

    // 1. Extract PDF Text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const pdfData = await extractText(buffer);
    const rawText = Array.isArray(pdfData.text) ? pdfData.text.join('\n\n') : pdfData.text || '';

    // 2. Prompt Gemini
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an expert resume parser, copywriter, and UI/UX designer. Extract the resume information and return it as a structured JSON object. 
    
    CRITICAL DESIGN INSTRUCTION:
    The user has requested the following visual theme: "${themePrompt}".
    Generate a highly readable, aesthetic color palette of HEX CODES that perfectly matches this description. Ensure there is strong contrast between the 'text' and 'background' colors.

    You MUST return the data using this exact JSON schema:
    {
      "name": "string", "email": "string", "linkedin": "string", "github": "string", "about": "string",
      "skills": ["string"],
      "projects": [{ "title": "string", "description": "string", "githubUrl": "string", "technologies": ["string"] }],
      "experience": [{ "role": "string", "company": "string", "duration": "string", "achievements": ["string"] }],
      "coverLetter": "string",
      "themeColors": {
        "background": "#HexCode", "text": "#HexCode", "primary": "#HexCode", "mutedText": "#HexCode", "cardBackground": "#HexCode", "cardBorder": "#HexCode"
      }
    }
    
    Resume text:
    ${rawText}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const structuredData = JSON.parse(responseText);

    // 3. Get the logged-in user securely
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    // 4. Save to Supabase (linking to user_id if they are logged in)
    const { error: dbError } = await supabaseServer
      .from('portfolios')
      .insert({ 
        username: username, 
        data: structuredData,
        user_id: user?.id || null // This makes it show up on their Dashboard
      });

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json({ error: 'That username is already taken. Please try another.' }, { status: 400 });
      }
      throw dbError;
    }

    // 5. Return the redirect URL
    return NextResponse.json({ success: true, redirectUrl: `/${username}` }, { status: 200 });

  } catch (error) {
    console.error("Parsing/DB error:", error);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}