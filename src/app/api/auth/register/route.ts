import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { shopName, shopAddress, ownerName, phone, email, password } = await request.json();

    // Validate input
    if (!shopName || !shopAddress || !ownerName || !phone || !email || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return new NextResponse('Invalid phone number format', { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse('User already exists with this email', { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      shopName,
      shopAddress,
      ownerName,
      phone,
      email,
      password: hashedPassword
    });

    // Save user to database
    await newUser.save();

    return new NextResponse('User registered successfully', { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return new NextResponse(
      error.message || 'An error occurred during registration',
      { status: 500 }
    );
  }
}
