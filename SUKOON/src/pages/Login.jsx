import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '') || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-lavender/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-mint/30 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-skyBlue/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo / Branding */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-lavender shadow-xl shadow-primary/30 mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Sparkles className="text-white" size={36} />
          </motion.div>
          <h1 className="text-3xl font-heading font-extrabold text-gray-800">SukoonAI</h1>
          <p className="text-gray-500 font-body mt-1 text-sm">Your calm, supportive AI companion</p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          className="glass rounded-[2rem] p-8 shadow-2xl border border-white/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-xl font-heading font-bold text-gray-800 mb-6 text-center">
            {isSignup ? 'Create your sanctuary' : 'Welcome back'}
          </h2>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 border border-white/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700 placeholder-gray-400 font-body text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/60 border border-white/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700 placeholder-gray-400 font-body text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-lavender text-white font-heading font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-body uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google */}
          <motion.button
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-heading font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
            whileTap={{ scale: 0.98 }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500 mt-6 font-body">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              className="text-primary font-semibold hover:underline transition"
            >
              {isSignup ? 'Sign In' : 'Create one'}
            </button>
          </p>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6 font-body">
          Your conversations are private and secure 🔒
        </p>
      </motion.div>
    </div>
  );
}
