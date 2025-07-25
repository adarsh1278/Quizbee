import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Types for WebSocket messages
export interface WSMessage {
  type: 'JOIN_ROOM' | 'START_QUIZ' | 'NEXT_QUESTION' | 'END_QUIZ' | 'ANSWER' | 'QUESTION_CHANGE' | 'QUIZ_END' | 'USER_JOINED' | 'USER_LEFT' | 'LEADERBOARD_UPDATE' | 'TEACHER_MESSAGE';
  payload: unknown;
}

export interface JoinRoomPayload {
  quizId: string;
  userId: string;
  userName: string;
  role: 'TEACHER' | 'STUDENT';
}

export interface StartQuizPayload {
  quizId: string;
}

export interface AnswerPayload {
  quizId: string;
  questionId: string;
  userId: string;
  answer: number;
  timeSpent: number;
}

export interface QuestionChangePayload {
  questionId: string;
  questionIndex: number;
  timeLimit: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  position: number;
}

export interface ConnectedUser {
  id: string;
  name: string;
  role: 'TEACHER' | 'STUDENT';
  joinedAt: string;
  isOnline: boolean;
  hasAnswered?: boolean;
}

export interface CurrentQuestion {
  id: string;
  index: number;
  question: string;
  options: string[];
  timeLimit: number;
  startTime: number;
  correctAnswer?: number;
}

interface WebSocketState {
  // Connection state
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectInterval: number;
  
  // Room state
  currentRoom: string | null;
  userRole: 'TEACHER' | 'STUDENT' | null;
  userId: string | null;
  userName: string | null;
  
  // Quiz state
  quizId: string | null;
  quizState: 'waiting' | 'starting' | 'in_progress' | 'question_change' | 'ended';
  currentQuestion: CurrentQuestion | null;
  
  // Users and leaderboard
  connectedUsers: ConnectedUser[];
  leaderboard: LeaderboardEntry[];
  
  // Student specific
  studentAnswers: Map<string, number>;
  studentScore: number;
  hasAnswered: boolean;
  answerFeedback: { correct: boolean; correctAnswer: number } | null;
  
  // Computed properties
  participants: ConnectedUser[];
  
  // Actions
  connect: (token: string) => void;
  disconnect: () => void;
  joinRoom: (payload: JoinRoomPayload) => void;
  startQuiz: (quizId: string, userId: string) => Promise<void>;
  nextQuestion: (quizId: string, userId: string) => Promise<void>;
  endQuiz: (quizId: string, userId: string) => Promise<void>;
  submitAnswer: (payload: AnswerPayload) => void;
  sendMessage: (message: { type: string; data: unknown }) => void;
  
  // Internal actions
  setSocket: (socket: WebSocket | null) => void;
  setConnectionState: (state: { isConnected: boolean; isConnecting: boolean; connectionError: string | null }) => void;
  handleMessage: (message: WSMessage) => void;
  resetState: () => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
}

export const useWebSocketStore = create<WebSocketState>()(
  subscribeWithSelector((set, get) => ({
    // Connection state
    socket: null,
    isConnected: false,
    isConnecting: false,
    connectionError: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectInterval: 3000,
    
    // Room state
    currentRoom: null,
    userRole: null,
    userId: null,
    userName: null,
    
    // Quiz state
    quizId: null,
    quizState: 'waiting',
    currentQuestion: null,
    
    // Users and leaderboard
    connectedUsers: [],
    leaderboard: [],
    
    // Student specific
    studentAnswers: new Map(),
    studentScore: 0,
    hasAnswered: false,
    answerFeedback: null,

    connect: (token: string) => {
      const state = get();
      
      if (state.socket || state.isConnecting) {
        console.log('Already connected or connecting');
        return;
      }

      set({ isConnecting: true, connectionError: null });

      try {
        const wsUrl = `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${window.location.host}/ws?token=${token}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('WebSocket connected');
          set({ 
            socket, 
            isConnected: true, 
            isConnecting: false, 
            connectionError: null 
          });
          get().resetReconnectAttempts();
        };

        socket.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data);
            get().handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        socket.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          set({ 
            socket: null, 
            isConnected: false, 
            isConnecting: false,
            connectionError: event.code !== 1000 ? 'Connection lost' : null
          });

          // Auto-reconnect logic
          const currentState = get();
          if (currentState.reconnectAttempts < currentState.maxReconnectAttempts && event.code !== 1000) {
            setTimeout(() => {
              console.log(`Attempting to reconnect... (${currentState.reconnectAttempts + 1}/${currentState.maxReconnectAttempts})`);
              get().incrementReconnectAttempts();
              get().connect(token);
            }, currentState.reconnectInterval);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          set({ 
            connectionError: 'Connection failed',
            isConnecting: false 
          });
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        set({ 
          connectionError: 'Failed to create connection',
          isConnecting: false 
        });
      }
    },

    disconnect: () => {
      const { socket } = get();
      if (socket) {
        socket.close(1000, 'User disconnected');
      }
      get().resetState();
    },

    joinRoom: (payload: JoinRoomPayload) => {
      const { socket, isConnected } = get();
      
      if (!socket || !isConnected) {
        console.error('Cannot join room: not connected');
        return;
      }

      const message: WSMessage = {
        type: 'JOIN_ROOM',
        payload
      };

      socket.send(JSON.stringify(message));
      
      set({
        currentRoom: payload.quizId,
        quizId: payload.quizId,
        userRole: payload.role,
        userId: payload.userId,
        userName: payload.userName
      });
    },

    // Computed properties
    get participants() {
      return get().connectedUsers;
    },

    startQuiz: async (quizId: string, userId: string) => {
      const { socket, isConnected, userRole } = get();
      
      if (!socket || !isConnected) {
        throw new Error('Cannot start quiz: not connected');
      }

      if (userRole !== 'TEACHER') {
        throw new Error('Only teachers can start quiz');
      }

      const message: WSMessage = {
        type: 'START_QUIZ',
        payload: { quizId, userId }
      };

      socket.send(JSON.stringify(message));
    },

    nextQuestion: async (quizId: string, userId: string) => {
      const { socket, isConnected, userRole } = get();
      
      if (!socket || !isConnected) {
        throw new Error('Cannot proceed to next question: not connected');
      }

      if (userRole !== 'TEACHER') {
        throw new Error('Only teachers can control quiz progression');
      }

      const message: WSMessage = {
        type: 'NEXT_QUESTION',
        payload: { quizId, userId }
      };

      socket.send(JSON.stringify(message));
    },

    endQuiz: async (quizId: string, userId: string) => {
      const { socket, isConnected, userRole } = get();
      
      if (!socket || !isConnected) {
        throw new Error('Cannot end quiz: not connected');
      }

      if (userRole !== 'TEACHER') {
        throw new Error('Only teachers can end quiz');
      }

      const message: WSMessage = {
        type: 'END_QUIZ',
        payload: { quizId, userId }
      };

      socket.send(JSON.stringify(message));
    },

    sendMessage: (message: { type: string; data: unknown }) => {
      const { socket, isConnected } = get();
      
      if (!socket || !isConnected) {
        console.error('Cannot send message: not connected');
        return;
      }

      socket.send(JSON.stringify(message));
    },

    submitAnswer: (payload: AnswerPayload) => {
      const { socket, isConnected, hasAnswered } = get();
      
      if (!socket || !isConnected) {
        console.error('Cannot submit answer: not connected');
        return;
      }

      if (hasAnswered) {
        console.error('Answer already submitted for this question');
        return;
      }

      const message: WSMessage = {
        type: 'ANSWER',
        payload
      };

      socket.send(JSON.stringify(message));
      
      // Mark as answered and store the answer
      set((state) => ({
        hasAnswered: true,
        studentAnswers: new Map(state.studentAnswers).set(payload.questionId, payload.answer)
      }));
    },

    handleMessage: (message: WSMessage) => {
      console.log('Received WebSocket message:', message);

      switch (message.type) {
        case 'USER_JOINED':
        case 'USER_LEFT': {
          const users = (message.payload as { users: ConnectedUser[] }).users;
          set({ connectedUsers: users });
          break;
        }

        case 'START_QUIZ': {
          set({ 
            quizState: 'starting',
            currentQuestion: null,
            hasAnswered: false,
            answerFeedback: null
          });
          break;
        }

        case 'QUESTION_CHANGE': {
          const questionData = message.payload as QuestionChangePayload & {
            question: string;
            options: string[];
          };
          
          set({ 
            quizState: 'in_progress',
            currentQuestion: {
              id: questionData.questionId,
              index: questionData.questionIndex,
              question: questionData.question,
              options: questionData.options,
              timeLimit: questionData.timeLimit,
              startTime: Date.now()
            },
            hasAnswered: false,
            answerFeedback: null
          });
          break;
        }

        case 'LEADERBOARD_UPDATE': {
          const payload = message.payload as { 
            leaderboard: LeaderboardEntry[]; 
            userScore?: number; 
            answerFeedback?: { correct: boolean; correctAnswer: number } | null 
          };
          const leaderboardData = payload.leaderboard;
          const studentScore = payload.userScore || 0;
          const answerFeedback = payload.answerFeedback || null;
          
          set({ 
            leaderboard: leaderboardData,
            studentScore,
            answerFeedback
          });
          break;
        }

        case 'QUIZ_END': {
          set({ 
            quizState: 'ended',
            currentQuestion: null,
            hasAnswered: false
          });
          break;
        }

        default:
          console.warn('Unknown message type:', message.type);
      }
    },

    setSocket: (socket: WebSocket | null) => set({ socket }),

    setConnectionState: (state) => set(state),

    resetState: () => set({
      socket: null,
      isConnected: false,
      isConnecting: false,
      connectionError: null,
      currentRoom: null,
      userRole: null,
      userId: null,
      userName: null,
      quizId: null,
      quizState: 'waiting',
      currentQuestion: null,
      connectedUsers: [],
      leaderboard: [],
      studentAnswers: new Map(),
      studentScore: 0,
      hasAnswered: false,
      answerFeedback: null
    }),

    incrementReconnectAttempts: () => 
      set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),

    resetReconnectAttempts: () => 
      set({ reconnectAttempts: 0 })
  }))
);
