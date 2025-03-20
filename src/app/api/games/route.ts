import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, result } = await request.json();
    
    if (!userId || !result) {
      return NextResponse.json(
        { error: 'User ID and result are required' },
        { status: 400 }
      );
    }
    
    // Validate result is one of the allowed enum values
    if (!['WIN', 'LOSS', 'DRAW'].includes(result)) {
      return NextResponse.json(
        { error: 'Result must be WIN, LOSS, or DRAW' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create new game
    const newGame = await prisma.game.create({
      data: {
        userId,
        result
      }
    });
    
    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}