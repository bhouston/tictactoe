import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        games: {
          select: {
            result: true
          }
        }
      }
    });
    
    // Calculate win/loss stats for each user
    const leaderboard = users.map(user => {
      const wins = user.games.filter(game => game.result === 'WIN').length;
      const losses = user.games.filter(game => game.result === 'LOSS').length;
      const draws = user.games.filter(game => game.result === 'DRAW').length;
      const totalGames = user.games.length;
      
      return {
        id: user.id,
        name: user.name,
        wins,
        losses,
        draws,
        totalGames,
        winRate: totalGames > 0 ? (wins / totalGames) * 100 : 0
      };
    });
    
    // Sort by wins (descending), then by win rate (descending)
    leaderboard.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winRate - a.winRate;
    });
    
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}