import React, { useState, useCallback, useRef } from 'react';
import { LogIn, Mail, Lock, Loader2, UserPlus, X } from 'lucide-react';
import Button from '../ui/Button';
import { signIn, signUp } from '../../lib/supabase';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface AttemptData {
  count: number;
  lastAttempt: number;
}

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  
  // Refs
  const authAttempts = useRef(new Map<string, AttemptData>());
  const captchaRef = useRef<HCaptcha>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
    setCaptchaToken(null);
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const enableButtonAfterDelay = useCallback(() => {
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 3000); // 3 second cooldown
  }, []);

  const checkRateLimit = (email: string): boolean => {
    const now = Date.now();
    const attemptData = authAttempts.current.get(email) || { count: 0, lastAttempt: 0 };
    
    // Reset count if last attempt was more than 1 minute ago
    if (now - attemptData.lastAttempt > 60000) {
      attemptData.count = 0;
    }

    if (attemptData.count >= 5) {
      return false;
    }

    authAttempts.current.set(email, {
      count: attemptData.count + 1,
      lastAttempt: now
    });

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!checkRateLimit(email)) {
      setError('Too many attempts. Please wait a minute and try again.');
      enableButtonAfterDelay();
      return;
    }

    if (!captchaToken) {
      setError('Please complete the captcha verification');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password, captchaToken);
        if (signUpError) throw signUpError;
        
        setSuccessMessage('Account created successfully! You can now sign in.');
        setIsSignUp(false);
        resetForm();
      } else {
        const { error: signInError } = await signIn(email, password, captchaToken);
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during authentication');
      enableButtonAfterDelay();
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <Button
            onClick={() => setShowForm(true)}
            leftIcon={<LogIn className="w-5 h-5" />}
          >
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-white dark:bg-slate-800 shadow-md mb-4">
            {isSignUp ? (
              <UserPlus className="w-8 h-8 text-slate-700 dark:text-slate-200" />
            ) : (
              <LogIn className="w-8 h-8 text-slate-700 dark:text-slate-200" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {isSignUp ? 'Create an account' : 'Welcome back! 👋'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {isSignUp ? 'Sign up to start managing your tasks' : 'Sign in to continue managing your tasks'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900 rounded-lg text-green-600 dark:text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center">
              {showForm && (
                <HCaptcha
                  key={`hcaptcha-${isSignUp}`}
                  ref={captchaRef}
                  sitekey="8a1c6b54-3de0-447a-8248-6a16f84c00c8"
                  onVerify={setCaptchaToken}
                  onExpire={() => setCaptchaToken(null)}
                  onError={(err) => {
                    console.error('hCaptcha Error:', err);
                    setError('Captcha verification failed. Please try again.');
                  }}
                  theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                />
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleCancel}
                leftIcon={<X className="w-5 h-5" />}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                fullWidth
                disabled={isLoading || isButtonDisabled || !captchaToken}
                leftIcon={
                  isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isSignUp ? (
                    <UserPlus className="w-5 h-5" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )
                }
              >
                {isLoading 
                  ? (isSignUp ? 'Signing up...' : 'Signing in...') 
                  : (isSignUp ? 'Sign Up' : 'Sign In')
                }
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  resetForm();
                }}
                className="text-slate-800 dark:text-white font-medium hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;