import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-secondary-600 mt-2">Join us in making roads safer</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-secondary-500">
                Must be at least 6 characters long
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-secondary-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-secondary-700">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors disabled:bg-primary-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-secondary-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary-600 hover:text-primary-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}