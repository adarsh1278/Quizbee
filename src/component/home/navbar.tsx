'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/axios';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="fixed z-20 w-full px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black dark:text-white">
          ScoreBee<span className="text-yellow-500">🐝</span>
        </Link>

        <nav className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-sm font-medium transition-colors ${
                pathname === item.path
                  ? 'text-black dark:text-white underline'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {!loading && user && (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
