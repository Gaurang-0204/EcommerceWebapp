import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import AnalyticsService from "../../services/AnalyticsService";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  
  const [error, setError] = useState("");
  
const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        AnalyticsService.trackEvent('login_success', { email });
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
        AnalyticsService.trackEvent('login_failed', { email, reason: result.error });
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  }, [email, password, login, navigate]);
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFE1A1]">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <div className="text-center mb-6">
          {/* <img
            src='../'
            alt="Hyper Logo"
            className="mb-4 h-12 mx-auto"
          /> */}
           
          <h1 className="text-gray-900 text-3xl font-semibold mb-2">Login</h1>
          {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register"
              className="ml-2 text-black-500 font-medium hover:underline"
              aria-label="Create an account"
            >
              Create today!
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-900 font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-900 font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="rememberme"
                type="checkbox"
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="rememberme" className="text-gray-900 ml-2">
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className=" font-medium hover:underline"
              aria-label="Forgot your password?"
            >
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled = {loading}
            className="w-full bg-primary text-white font-medium rounded-md px-4 py-2  focus:ring focus:ring-blue-300 flex items-center justify-center"
            aria-label="Sign In"
          >
           {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
