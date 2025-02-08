import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Github } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { useAuth } from './AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const emailKey = email.replace(/\./g, ',');
      const response = await fetch(`https://virtualclassroom-project-default-rtdb.firebaseio.com/Users/${emailKey}.json`);
      const userData = await response.json();

      if (!userData) {
        // User doesn't exist, show create account form
        setShowCreateAccount(true);
        toast.info('Please create an account first');
      } else if (userData.password === password) {
        // Login successful
        const user = {
          email,
          name: userData.name,
          id: emailKey
        };
        login(user);
        toast.success('Login successful!');
        navigate('/video-conference');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const emailKey = email.replace(/\./g, ',');
      
      // Create new user
      const response = await fetch(`https://virtualclassroom-project-default-rtdb.firebaseio.com/Users/${emailKey}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName} ${lastName}`,
          createdAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const user = {
          email,
          name: `${firstName} ${lastName}`,
          id: emailKey
        };
        
        login(user);
        toast.success('Account created successfully!');
        navigate('/video-conference');
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to create account: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
      const GITHUB_REDIRECT_URI = `${window.location.origin}/auth/github/callback`;
      const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email`;
      
      window.location.href = githubUrl;
    } catch (error) {
      toast.error('GitHub login failed: ' + error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{backgroundImage: "url('https://wallpapercave.com/wp/wp2940000.jpg')"}}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content - Added flex container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gray-800/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
          <div>
            <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
              {showCreateAccount ? 'Create Account' : 'Sign in'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              {showCreateAccount ? 'Join our virtual classroom' : 'Welcome back'}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGitHubLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-white/20 rounded-md text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </button>
            <button
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-white/20 rounded-md text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Twitter className="mr-2 h-5 w-5" />
              Twitter
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-200">Or continue with</span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={showCreateAccount ? handleCreateAccount : handleSubmit}>
            {showCreateAccount && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                      placeholder="First Name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={showCreateAccount ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder={showCreateAccount ? 'Create a password' : 'Enter your password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600/80 hover:bg-blue-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading 
                  ? (showCreateAccount ? 'Creating account...' : 'Signing in...') 
                  : (showCreateAccount ? 'Create Account' : 'Sign in')}
              </button>
            </div>
          </form>

          {!showCreateAccount && (
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 