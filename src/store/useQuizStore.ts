import { create } from 'zustand';
import toast from 'react-hot-toast';
import { toastNotifications } from '@/lib/toastNotifications';
import api from '@/lib/axios';

interface Player {
  id: string;
  name: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface CreateQuizQuestion {
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  marks: number;
  timeLimit: number;
}

interface CreateQuizResponse {
  message: string;
  quizId: string;
}

interface QuizState {
  username: string;
  email: string;
  institution: string;
  roomCode: string;
  isHost: boolean;
  score: number;
  players: Player[];
  currentQuestion: Question | null;
  quizStarted: boolean;
   setUsername: (name: string) => void;
  setEmail: (email: string) => void;
  setInstitution: (inst: string) => void;
  setRole: (role: 'student' | 'Teacher' | null) => void;
  setRoomCode: (code: string) => void;
  setIsHost: (host: boolean) => void;
  incrementScore: () => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setQuizStarted: (started: boolean) => void;
  resetQuiz: () => void;
  
  // Quiz creation actions
  createQuiz: (title: string, questions: CreateQuizQuestion[]) => Promise<void>;
  clearCreateState: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  username: '',
  email: '',
  institution: '',
  roomCode: '',
  isHost: false,
  score: 0,
  players: [],
  currentQuestion: null,
  quizStarted: false,
  role: null,
  
  // Quiz creation state
  isCreating: false,
  createdQuizId: null,
  createError: null,

  setUsername: (name) => set({ username: name }),
  setEmail: (email) => set({ email }),
  setInstitution: (inst) => set({ institution: inst }),
  setRole: (role) => set({ role }),
  setRoomCode: (code) => set({ roomCode: code }),
  setIsHost: (host) => set({ isHost: host }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  setPlayers: (players) => set({ players }),
  addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setQuizStarted: (started) => set({ quizStarted: started }),
  resetQuiz: () =>
    set({
      username: '',
      email: '',
      institution: '',
      role: null,
      roomCode: '',
      isHost: false,
      score: 0,
      players: [],
      currentQuestion: null,
      quizStarted: false,
    }),
    
  // Quiz creation actions
  createQuiz: async (title: string, questions: CreateQuizQuestion[]) => {
    set({ isCreating: true, createError: null, createdQuizId: null });
    
    const loadingToast = toastNotifications.loading.creatingQuiz();
    
    try {
      const maxScore = questions.reduce((total, q) => total + q.marks, 0);
      
      const response = await api.post<CreateQuizResponse>('/quiz/create', {
        title,
        maxScore,
        questions
      });
      
      toast.dismiss(loadingToast);
      toastNotifications.success.quizCreated();
      
      set({ 
        isCreating: false, 
        createdQuizId: response.data.quizId,
        createError: null 
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      
      const errorMessage = error.response?.data?.error || 'Failed to create quiz';
      toast.error(errorMessage);
      
      set({ 
        isCreating: false, 
        createError: errorMessage,
        createdQuizId: null 
      });
    }
  },
  
  clearCreateState: () => set({ 
    isCreating: false, 
    createdQuizId: null, 
    createError: null 
  }),
}));
