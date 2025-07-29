"use client";



import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { Question, LeaderboardData, WebSocketUser } from "@/types/globaltypes";
import LoadingSpinner from "@/component/ui/loading-spinner";

// Import separated components
import {
    Timer as QuizTimer,
    QuestionCard as QuizQuestionCard,
    RankDisplay as QuizRankDisplay,
    Leaderboard as QuizLeaderboard
} from "@/component/quiz";
import WaitingScreen from "./waitingCompenet";


export default function StudentQuizPage() {
    // URL parameters and routing
    const params = useParams();
    const quizId = params.quizId as string;

    // WebSocket store state and actions
    const {
        socket,
        loading,
        quizStarted,
        liveUsers,
        leaderboard,
        currentQuestion,
        roomJoined,
        totalmarks,
        rank,
        connect,
        joinRoom,
        sendMessage,
    } = useWebSocketStore();

    // Local component state
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);


    useEffect(() => {
        if (!socket) {
            connect();
        }
    }, [socket, connect]);


    useEffect(() => {
        if (socket && quizId && !roomJoined && !loading) {
            joinRoom(quizId);
        }
    }, [socket, quizId, roomJoined, loading, joinRoom]);


    useEffect(() => {
        if (currentQuestion) {
            setSelectedAnswer(null);
            setIsAnswered(false);
        }
    }, [currentQuestion]);


    const handleAnswerSelect = (optionIndex: number) => {
        if (isAnswered) return;

        setSelectedAnswer(optionIndex);
        setIsAnswered(true);


        sendMessage('answer', {
            quizId,
            answerIndex: optionIndex,
            questionId: currentQuestion?.question // Using question text as ID
        });
    };


    const handleTimeUp = () => {
        if (!isAnswered) {
            setIsAnswered(true);
            // Send timeout message to server
            sendMessage('timeout', { quizId });
        }
    };


    if (!roomJoined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100" onClick={() => (console.log(liveUsers))}>
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Joining Quiz Room
                    </h3>
                    <p className="text-gray-600">
                        Please wait while we connect you to the quiz...
                    </p>
                </div>
            </div>
        );
    }


    if (!quizStarted) {
        return (
            <WaitingScreen liveUsers={liveUsers} quizStarted={quizStarted} />

        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Quiz Room: {quizId}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                🟢 {users.length} participant{users.length !== 1 ? 's' : ''} online
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Your Score</div>
                            <div className="text-2xl font-bold text-blue-600">{totalmarks}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">

                <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
                    {/* Left Column - Question, Timer, and Rank */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Timer */}
                        <QuizTimer
                            timeLimit={currentQuestion.timeLimit * 60} // Convert minutes to seconds
                            onTimeUp={handleTimeUp}
                        />


                        {isAnswered && (
                            <QuizRankDisplay
                                rank={rank}
                                totalMarks={totalmarks}
                            />
                        )}


                        <QuizQuestionCard
                            question={currentQuestion}
                            onAnswerSelect={handleAnswerSelect}
                            selectedAnswer={selectedAnswer}
                            isAnswered={isAnswered}
                        />
                    </div>


                    <div className="lg:col-span-1">
                        <QuizLeaderboard
                            leaderboard={leaderboard}
                            users={users}
                        />
                    </div>
                </div>


                <div className="lg:hidden space-y-6">

                    <QuizTimer
                        timeLimit={currentQuestion.timeLimit * 60} // Convert minutes to seconds
                        onTimeUp={handleTimeUp}
                    />


                    {isAnswered && (
                        <QuizRankDisplay
                            rank={rank}
                            totalMarks={totalmarks}
                        />
                    )}


                    <QuizQuestionCard
                        question={currentQuestion}
                        onAnswerSelect={handleAnswerSelect}
                        selectedAnswer={selectedAnswer}
                        isAnswered={isAnswered}
                    />


                    <QuizLeaderboard
                        leaderboard={leaderboard}
                        users={users}
                    />
                </div>
            </div>
        </div>
    );
}