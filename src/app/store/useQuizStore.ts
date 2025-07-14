import { create } from 'zustand';

interface QuizState {
  username: string;
  email: string;
  institution: string;
  roomCode: string;
  isHost: boolean;
  score: number;
  players: any[];
  currentQuestion: any;
  quizStarted: boolean;
  role: 'student' | 'examiner' | null;

  setUsername: (name: string) => void;
  setEmail: (email: string) => void;
  setInstitution: (inst: string) => void;
  setRole: (role: 'student' | 'examiner' | null) => void;
  setRoomCode: (code: string) => void;
  setIsHost: (host: boolean) => void;
  incrementScore: () => void;
  setPlayers: (players: any[]) => void;
  addPlayer: (player: any) => void;
  setCurrentQuestion: (question: any) => void;
  setQuizStarted: (started: boolean) => void;
  resetQuiz: () => void;
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
}));
