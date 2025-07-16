'use client';

import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { Button } from '@/component/ui/button';
import { Card, CardContent } from '@/component/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FC } from 'react';

type StatItem = {
  title: string;
  value: string;
  icon: string;
};

type QuizItem = {
  id: string;
  name: string;
  participants: number;
  date: string;
  status: 'Active' | 'Completed';
};

type PerformanceDataItem = {
  name: string;
  avgScore: number;
};

const dashboardPage: FC = () => {
  const router = useRouter();
  const username = useQuizStore((state) => state.username);

  const stats: StatItem[] = [
    { title: 'Quizzes Created', value: '4', icon: '📝' },
    { title: 'Participants', value: '120+', icon: '👥' },
    { title: 'Avg. Score', value: '78%', icon: '🎯' },
    { title: 'This Month', value: '12', icon: '📈' }
  ];

  const recentQuizzes: QuizItem[] = [
    { id: 'quiz-1', name: 'JavaScript Basics', participants: 45, date: '2d ago', status: 'Active' },
    { id: 'quiz-2', name: 'React Concepts', participants: 32, date: '7d ago', status: 'Completed' },
    { id: 'quiz-3', name: 'CSS Grid Test', participants: 28, date: '14d ago', status: 'Completed' }
  ];

  const performanceData: PerformanceDataItem[] = [
    { name: 'JS', avgScore: 72 },
    { name: 'React', avgScore: 81 },
    { name: 'CSS', avgScore: 64 },
  ];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-semibold">
              Welcome, {username?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 mt-1">Create, manage and review your quizzes.</p>
          </div>
          <Button
            onClick={() => router.push('/dashboard/create')}
            className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-6 py-2 rounded-md transition"
          >
            + Create New Quiz
          </Button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <Card key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h3 className="text-xl font-medium mt-1">{item.value}</h3>
                </div>
                <span className="text-2xl">{item.icon}</span>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Quizzes */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Quizzes</h2>
              <Button variant="ghost" className="text-gray-600 hover:underline text-sm">View All</Button>
            </div>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-4 space-y-2">
                {recentQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    onClick={() =>
                      quiz.status === 'Completed' &&
                      router.push(`/dashboard/analytics/${quiz.id}`)
                    }
                    className="flex justify-between items-center px-2 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{quiz.name}</p>
                      <p className="text-sm text-gray-500">
                        {quiz.participants} participants • {quiz.date}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        quiz.status === 'Active'
                          ? 'bg-gray-100 text-black dark:bg-gray-700 dark:text-white'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Quick Actions</h3>
                <Button
                  onClick={() => router.push('/dashboard/create')}
                  className="w-full bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  Create Quiz
                </Button>
                <Button variant="outline" className="w-full border-gray-300 dark:border-gray-700">
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Chart */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-5 text-center">
                <h3 className="font-semibold mb-4">Performance Overview</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }} />
                      <Bar dataKey="avgScore" fill="#6b7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default dashboardPage;
