/**
 * On-demand WebSocket hook for quiz rooms
 * Only connects when actually needed
 */

import { useEffect, useRef, useCallback } from 'react';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import { useAuthStore } from '@/store/userAuthStore';

interface UseQuizWebSocketOptions {
  quizId: string;
  enabled?: boolean;
  autoConnect?: boolean;
}

export function useQuizWebSocket({ 
  quizId, 
  enabled = true, 
  autoConnect = true 
}: UseQuizWebSocketOptions) {
  const { user } = useAuthStore();
  const {
    connect,
    disconnect,
    joinRoom,
    isConnected,
    isConnecting,
    connectionError,
    currentRoom,
    quizState,
    currentQuestion,
    hasAnswered,
    answerFeedback,
    studentScore,
    submitAnswer,
    connectedUsers
  } = useWebSocketStore();

  const hasJoinedRoom = useRef(false);
  const connectionRef = useRef<string | null>(null);

  // Connect to WebSocket when needed
  const connectToQuiz = useCallback(async () => {
    if (!user || !enabled) return;

    try {
      // Get auth token
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Connect if not already connected
      if (!isConnected && !isConnecting) {
        connectionRef.current = quizId;
        connect(token);
        
        // Wait a moment for connection to establish
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Join specific quiz room
      if (isConnected && currentRoom !== quizId && !hasJoinedRoom.current) {
        hasJoinedRoom.current = true;
        joinRoom({
          quizId,
          userId: user.id,
          userName: user.firstName || user.email.split('@')[0],
          role: user.role === 'ADMIN' ? 'TEACHER' : user.role as 'STUDENT' | 'TEACHER'
        });
      }
    } catch (error) {
      console.error('Failed to connect to quiz WebSocket:', error);
    }
  }, [user, enabled, quizId, isConnected, isConnecting, currentRoom, connect, joinRoom]);

  // Disconnect and cleanup
  const disconnectFromQuiz = useCallback(() => {
    hasJoinedRoom.current = false;
    
    // Only disconnect WebSocket if this component initiated the connection
    if (connectionRef.current === quizId) {
      disconnect();
      connectionRef.current = null;
    }
  }, [quizId, disconnect]);

  // Auto-connect when enabled
  useEffect(() => {
    if (enabled && autoConnect && user) {
      connectToQuiz();
    }

    return () => {
      if (enabled) {
        disconnectFromQuiz();
      }
    };
  }, [enabled, autoConnect, user, connectToQuiz, disconnectFromQuiz]);

  return {
    // Connection methods
    connectToQuiz,
    disconnectFromQuiz,
    
    // Connection state
    isConnected: isConnected && currentRoom === quizId,
    isConnecting,
    connectionError,
    isInRoom: currentRoom === quizId,
    
    // Quiz data from store
    quizState,
    currentQuestion,
    hasAnswered,
    answerFeedback,
    studentScore,
    connectedUsers,
    
    // Quiz actions
    submitAnswer,
    startQuiz: useWebSocketStore.getState().startQuiz,
    nextQuestion: useWebSocketStore.getState().nextQuestion,
    endQuiz: useWebSocketStore.getState().endQuiz,
    sendMessage: useWebSocketStore.getState().sendMessage,
    
    // Raw store access for advanced usage
    store: useWebSocketStore
  };
}
