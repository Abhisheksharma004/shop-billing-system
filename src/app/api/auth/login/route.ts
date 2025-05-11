import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    // Create session or token here
    // For now, we'll just return success
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
