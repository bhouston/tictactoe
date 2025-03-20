import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // Don't return the email in a production environment
        // email: process.env.NODE_ENV === 'development',
        createdAt: true,
        _count: {
          select: { games: true }
        }
      }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      // Update the name if it's different
      if (existingUser.name !== name) {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { name }
        });
        return NextResponse.json(updatedUser);
      }
      return NextResponse.json(existingUser);
    }
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      }
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}