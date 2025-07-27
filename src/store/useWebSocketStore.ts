import { create } from 'zustand';
import toast from 'react-hot-toast';
import { getCookie } from '@/utils/getToken';

type User = { userId: string; name: string };
type Question = {
  question: string;
  options: string[];
  marks: number;
 
  timeLimit: number;
};
type RoomJoined = {
  [quizId: string]: boolean;
};

interface QuizStore {
  socket: WebSocket | null;
  loading: boolean;
  users: User[];
  leaderboard: Record<string, number>;
  currentQuestion: Question | null;
  roomJoined: RoomJoined;
  totalmarks:number;
  rank:0;
  connect: () => void;
  joinRoom: (quizId: string) => void;
  sendMessage: (type: string, payload: any) => void;

  setUsers: (users: User[]) => void;
  setLeaderboard: (data: Record<string, number>) => void;
  setQuestion: (q: Question) => void;
}

export const useWebSocketStore = create<QuizStore>((set, get) => ({
  socket: null,
  loading: false,
  users: [],
  leaderboard: {},
  currentQuestion: null,
  roomJoined: {},
  totalmarks:0,
  rank:0,

  connect: () => {
    set({ loading: true });

    const token = getCookie('token');
    if (!token) {
      toast.error('Login required');
      set({ loading: false });
      return;
    }

    const loadingToastId = toast.loading('Connecting to WebSocket...');

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}?token=${token}`
    );

    console.log('Connecting to WebSocket:', ws);
    set({ socket: ws });

    ws.onopen = () => {
      set({ loading: false });
      toast.success('Connected to WebSocket', { id: loadingToastId });
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'leaderboard') {
        set({ leaderboard: msg.data });
      }

      if (msg.type === 'question') {
        set({ currentQuestion: msg.data });
      }

      if (msg.type === 'users') {
        set({ users: msg.data });
      }
       if (msg.type === 'rank') {
        set({ totalmarks: msg.data,
              rank:msg.rank,
         });
      }

      if (msg.type === 'roomJoined') {
        set((state) => ({
          roomJoined: {
            ...state.roomJoined,
            [msg.quizId]: true,
          },
          loading: false,
        }));

        toast.success('Joined quiz room successfully');
      }
    };

    ws.onerror = (err) => {
      set({ loading: false });
      console.error('WebSocket error:', err);
      toast.error('WebSocket error', { id: loadingToastId });
    };

    ws.onclose = (error: any) => {
      console.error('WebSocket closed:', error);
      toast.error('WebSocket connection closed', { id: loadingToastId });
      set({ socket: null });

      setTimeout(() => {
        get().connect(); // Reconnect
      }, 3000);
    };
  },

  joinRoom: (quizId: string) => {
    const { sendMessage } = get();

    
    set({ loading: true });
    const toastId = toast.loading('Joining quiz room...');

    sendMessage('room:join', { quizId });

    
  },

  sendMessage: (type: string, payload: any) => {
    const socket = get().socket;

    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = { type, payload };
      socket.send(JSON.stringify(message));
    } else {
      toast.error('WebSocket is not connected');
    }
  },

  setUsers: (users) => set({ users }),
  setLeaderboard: (data) => set({ leaderboard: data }),
  setQuestion: (q) => set({ currentQuestion: q }),
}));
