'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // This will be implemented later when we have the API route
      // For now, we'll just redirect to a placeholder game page
      // TODO: Replace with actual API call to save user info
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store user info in localStorage for now (temporary solution)
      localStorage.setItem('tictactoe-user', JSON.stringify({ name, email }));
      
      // Redirect to game page (to be created)
      router.push('/game');
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your email will be used as your unique identifier.
          </p>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Please wait...' : 'Start Playing'}
          </button>
        </div>
      </form>
    </div>
  );
}