'use client';

import { useEffect, useRef } from 'react';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import { useAuthStore } from '@/store/userAuthStore';

interface WebSocketProviderProps {
    children: React.ReactNode;
}

export default function WebSocketProvider({ children }: WebSocketProviderProps) {
    const { user } = useAuthStore();
    const {
        connect,
        disconnect,
        isConnected,
        isConnecting,
        connectionError,
        reconnectAttempts,
        maxReconnectAttempts
    } = useWebSocketStore();

    const hasAttemptedConnection = useRef(false);

    useEffect(() => {
        // Only connect if user is authenticated and we haven't attempted connection yet
        if (user && !hasAttemptedConnection.current && !isConnected && !isConnecting) {
            hasAttemptedConnection.current = true;

            // Get token from cookies or localStorage
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

            if (token) {
                connect(token);
            }
        }

        // Cleanup on unmount or user logout
        return () => {
            if (!user) {
                disconnect();
                hasAttemptedConnection.current = false;
            }
        };
    }, [user, connect, disconnect, isConnected, isConnecting]);

    // Show connection status in development
    if (process.env.NODE_ENV === 'development' && user) {
        if (isConnecting) {
            console.log('🔌 WebSocket connecting...');
        } else if (isConnected) {
            console.log('✅ WebSocket connected');
        } else if (connectionError) {
            console.log(`❌ WebSocket error: ${connectionError} (${reconnectAttempts}/${maxReconnectAttempts})`);
        }
    }

    return <>{children}</>;
}
