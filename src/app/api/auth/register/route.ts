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

    // Create user
    const user = await User.create({
      shopName,
      shopAddress,
      ownerName,
      phone,
      email,
      password: hashedPassword,
    });

    // Return success but don't send password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return NextResponse.json(userWithoutPassword, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
