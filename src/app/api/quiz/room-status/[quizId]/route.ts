import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ quizId: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { quizId } = await params;

    // TODO: Replace with actual Redis check
    // This is a mock implementation - you'd typically check Redis cache here
    // Example: const roomExists = await redis.exists(`quiz:${quizId}`);
    
    // For now, simulate checking if a quiz room exists
    // In reality, this would check your Redis cache or WebSocket room registry
    console.log(`Checking room status for quiz: ${quizId}`);
    const mockRoomExists = true; // You'd replace this with actual Redis/room check
    
    if (mockRoomExists) {
      return NextResponse.json({ 
        exists: true, 
        status: 'active',
        message: 'Quiz room is available'
      });
    } else {
      return NextResponse.json({ 
        exists: false, 
        status: 'waiting',
        message: 'Quiz room not created yet'
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error checking room status:', error);
    return NextResponse.json(
      { error: 'Failed to check room status' },
      { status: 500 }
    );
  }
}
