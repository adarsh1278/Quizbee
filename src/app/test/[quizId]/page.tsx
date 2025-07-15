"use client"

import { useParams } from 'next/navigation';

export default function TestPage() {
    const params = useParams();
    const quizId = params.quizId;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Take Quiz</h1>
                    <p className="text-gray-600">Quiz ID: {quizId}</p>
                    <div className="mt-8">
                        <p className="text-center text-gray-500">Quiz interface coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}