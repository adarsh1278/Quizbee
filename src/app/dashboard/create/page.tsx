"use client"
import { useEffect, useState, useRef } from "react";
import { toastNotifications } from "@/lib/toastNotifications";
import Questions from "./Question";
import AIQuizGenerator from "./AIQuizGenerator";
import QuizSidebar from "./QuizSidebar";
import QuizCreatedModal from "@/component/dashboard/QuizCreatedModal";
import LoadingSpinner from "@/component/ui/loading-spinner";
import { Input } from "@/component/ui/input";
import { Label } from "@/components/ui/label";
import { useQuizStore } from "@/store/useQuizStore";
import type { GeneratedQuestion } from "@/lib/gemini";

interface Question {
    id: number;
    type: 'mcq';
    options: [string, string, string, string];
    text: string;
    marks: number;
    time: number; // in minutes
    correctAnswer: number; // 0-3 for option A-D
}

export default function EvaluationQuestions() {
    const [quizTitle, setQuizTitle] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Zustand store
    const {
        isCreating,
        createdQuizId,
        createQuiz,
        clearCreateState
    } = useQuizStore();

    useEffect(() => {
        console.log("Questions Updated:", questions);
    }, [questions]);

    function updateSpecificField(id: number, property: keyof Question, newValue: string | number | [string, string, string, string]) {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === id ? { ...question, [property]: newValue } : question
            )
        );
    }

    function addNewQuestion() {
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            {
                id: prevQuestions.length + 1,
                type: "mcq",
                options: ["Option A", "Option B", "Option C", "Option D"],
                marks: 10,
                time: 2,
                text: "New MCQ question",
                correctAnswer: 0,
            },
        ]);

        toastNotifications.success.questionAdded();

        setTimeout(() => {
            if (questionRefs.current[questions.length]) {
                questionRefs.current[questions.length]?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 250);
    }

    function setQuestionText(id: number, value: string) {
        updateSpecificField(id, "text", value);
    }

    function setQuestionOption(id: number, optionIndex: number, value: string) {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === id
                    ? { ...question, options: question.options.map((opt, idx) => idx === optionIndex ? value : opt) as [string, string, string, string] }
                    : question
            )
        );
    }

    function setQuestionMarks(id: number, value: number) {
        updateSpecificField(id, "marks", value);
    }

    function setQuestionTime(id: number, value: number) {
        updateSpecificField(id, "time", value);
    }

    function setCorrectAnswer(id: number, value: number) {
        updateSpecificField(id, "correctAnswer", value);
    }

    function deleteQuestion(questionIndex: number) {
        setQuestions((prevQuestions) =>
            prevQuestions.filter((_, index) => index !== questionIndex)
        );
        toastNotifications.success.questionDeleted();
    }

    function handleAIGeneratedQuestions(generatedQuestions: GeneratedQuestion[]) {
        const newQuestions: Question[] = generatedQuestions.map((q, index) => ({
            ...q,
            id: questions.length + index + 1,
        }));

        setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);

        // Scroll to first new question
        setTimeout(() => {
            const firstNewIndex = questions.length;
            if (questionRefs.current[firstNewIndex]) {
                questionRefs.current[firstNewIndex]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }, 250);
    }

    function scrollToQuestion(index: number) {
        questionRefs.current.forEach((ref) => {
            if (ref) ref.classList.remove("highlight");
        });

        if (questionRefs.current[index]) {
            questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
            questionRefs.current[index]?.classList.add("highlight");

            setTimeout(() => {
                if (questionRefs.current[index]) {
                    questionRefs.current[index]?.classList.remove("highlight");
                }
            }, 3000);
        }
    }

    async function handleCreateQuiz() {
        if (!quizTitle.trim()) {
            toastNotifications.error.missingTitle();
            return;
        }

        if (questions.length === 0) {
            toastNotifications.error.noQuestions();
            return;
        }

        // Validate questions
        const invalidQuestions = questions.filter(q =>
            !q.text.trim() ||
            q.options.some(opt => !opt.trim()) ||
            q.marks <= 0 ||
            q.time <= 0
        );

        if (invalidQuestions.length > 0) {
            toastNotifications.error.invalidQuestions();
            return;
        }

        // Transform questions to match API format
        const apiQuestions = questions.map(q => ({
            question: q.text,
            options: q.options,
            answerIndex: q.correctAnswer,
            marks: q.marks,
            timeLimit: q.time
        }));

        await createQuiz(quizTitle, apiQuestions);
    }

    return (<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
            {/* Header with Quiz Title */}
            <div className="mb-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Quiz</h1>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quizTitle" className="text-lg font-medium">Quiz Title</Label>
                            <Input
                                id="quizTitle"
                                type="text"
                                placeholder="Enter your quiz title (e.g., JavaScript Fundamentals Quiz)"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                className="text-lg h-12"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={addNewQuestion}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                            >
                                Add Question Manually
                            </button>
                            <AIQuizGenerator onQuestionsGenerated={handleAIGeneratedQuestions} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Left Section - Questions */}
                <div className="flex-1">
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {questions.map((question, index) => (
                                <div
                                    key={question.id}
                                    ref={(el) => {
                                        questionRefs.current[index] = el;
                                    }}
                                    className="transition-all duration-300"
                                >
                                    <Questions
                                        index={index}
                                        question={question}
                                        setQuestionText={setQuestionText}
                                        setQuestionOption={setQuestionOption}
                                        setQuestionMarks={setQuestionMarks}
                                        setQuestionTime={setQuestionTime}
                                        setCorrectAnswer={setCorrectAnswer}
                                        deleteQuestion={deleteQuestion}
                                    />
                                </div>
                            ))}                                {questions.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No questions yet</h3>
                                    <p className="text-gray-600 mb-4">Your quiz questions will appear here once you add them</p>
                                </div>
                            )}
                        </div>

                        {questions.length > 0 && (
                            <>
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={handleCreateQuiz}
                                        disabled={isCreating || !quizTitle.trim()}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center gap-2 disabled:cursor-not-allowed"
                                    >
                                        {isCreating ? (
                                            <>
                                                <LoadingSpinner size="sm" className="text-white" />
                                                Creating Quiz...
                                            </>
                                        ) : (
                                            'Create Quiz'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Section - Sidebar */}
                <div className="w-80">
                    <QuizSidebar
                        questions={questions}
                        onQuestionClick={scrollToQuestion}
                    />
                </div>
            </div>
        </div>

        {/* Success Modal */}
        {createdQuizId && (
            <QuizCreatedModal
                isOpen={!!createdQuizId}
                onClose={clearCreateState}
                quizId={createdQuizId}
                quizTitle={quizTitle}
            />
        )}
    </div>
    );
}