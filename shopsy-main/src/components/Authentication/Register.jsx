/**
 * @fileoverview Optimized Registration Component with Analytics
 * Compatible with your existing AuthService, AnalyticsService, and AuthContext
 * 
 * Features:
 * - Real-time validation
 * - Analytics tracking
 * - Better error handling
 * - Loading states
 * - Password strength indicator
 * - Form progress tracking
 */

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AuthService from "../../services/AuthService";
import AnalyticsService from "../../services/AnalyticsService";

const Register = () => {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formStartTime] = useState(Date.now());

  // =========================================================================
  // ANALYTICS TRACKING
  // =========================================================================

  useEffect(() => {
    // Track page view
    AnalyticsService.trackPageView('register');
    
    // Track registration form start
    AnalyticsService.trackEvent('registration_started', {
      timestamp: new Date().toISOString()
    });

    // Cleanup: track form abandonment
    return () => {
      if (!success && !loading) {
        const timeSpent = (Date.now() - formStartTime) / 1000;
        AnalyticsService.trackEvent('registration_form_abandoned', {
          timeSpent,
          fieldsCompleted: Object.values(formData).filter(v => v !== '').length
        });
      }
    };
  }, [formStartTime, success, loading]);

  // =========================================================================
  // PASSWORD STRENGTH CHECKER
  // =========================================================================

  const checkPasswordStrength = useCallback((password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  }, []);

  // =========================================================================
  // VALIDATION
  // =========================================================================

  const validateField = useCallback((name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (value.length < 3) {
          error = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Username can only contain letters, numbers, and underscores";
        }
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email address";
        }
        break;

      case "password":
        if (value.length < 8) {
          error = "Password must be at least 8 characters";
        }
        break;

      case "password_confirm":
        if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      case "first_name":
      case "last_name":
        if (value && value.length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;

      default:
        break;
    }

    return error;
  }, [formData.password]);

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Update password strength
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Track field completion
    if (value && !formData[name]) {
      AnalyticsService.trackEvent('registration_field_completed', {
        field: name
      });
    }
  }, [validateField, checkPasswordStrength, formData]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'password_confirm') { // Skip password_confirm in validation loop
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Validate password confirmation separately
    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Track validation errors
      AnalyticsService.trackEvent('registration_validation_failed', {
        errors: Object.keys(newErrors)
      });
      
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const timeToComplete = (Date.now() - formStartTime) / 1000;
      
      // Register user using your AuthService
      const result = await AuthService.register(
        formData.email,
        formData.username,
        formData.password,
        formData.first_name,
        formData.last_name
      );

      if (result.success) {
        setSuccess(true);
        
        // Track successful registration
        AnalyticsService.trackEvent('registration_completed', {
          timeToComplete,
          username: formData.username,
          hasName: !!(formData.first_name && formData.last_name)
        });

        // Flush analytics events
        AnalyticsService.flushEvents();

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Registration successful! Please login.' }
          });
        }, 2000);
      } else {
        // Handle specific error messages from backend
        const errorMessage = result.error || 'Registration failed. Please try again.';
        setErrors({ submit: errorMessage });
        
        // Track registration failure
        AnalyticsService.trackEvent('registration_failed', {
          error: errorMessage,
          timeToComplete
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        submit: error.message || 'Registration failed. Please check your connection and try again.' 
      });
      
      // Track error
      AnalyticsService.trackEvent('registration_error', {
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // HELPER FUNCTIONS
  // =========================================================================

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 py-8 px-4">
      <div className="bg-white p-8 shadow-2xl rounded-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary font-semibold hover:underline"
              onClick={() => AnalyticsService.trackEvent('register_to_login_clicked', {})}
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <FaCheckCircle className="text-green-500 mr-3 text-xl" />
            <div>
              <p className="text-green-800 font-semibold">Registration Successful!</p>
              <p className="text-green-600 text-sm">Redirecting to login...</p>
            </div>
          </div>
        )}

        {/* Form Error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <FaTimesCircle className="text-red-500 mr-3 text-xl" />
            <p className="text-red-800">{errors.submit}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.username
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-primary/30'
              }`}
              placeholder="Choose a username"
              required
              disabled={loading}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-primary/30'
              }`}
              placeholder="your.email@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-gray-700 font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.first_name
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary/30'
                }`}
                placeholder="First name"
                disabled={loading}
                autoComplete="given-name"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-gray-700 font-semibold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.last_name
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary/30'
                }`}
                placeholder="Last name"
                disabled={loading}
                autoComplete="family-name"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition pr-12 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary/30'
                }`}
                placeholder="Create a strong password"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password Strength:</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength < 30 ? 'text-red-500' :
                    passwordStrength < 60 ? 'text-yellow-500' :
                    passwordStrength < 80 ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="password_confirm" className="block text-gray-700 font-semibold mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition pr-12 ${
                  errors.password_confirm
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary/30'
                }`}
                placeholder="Confirm your password"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
              >
                {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password_confirm && (
              <p className="text-red-500 text-sm mt-1">{errors.password_confirm}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading || success
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : success ? (
              'Registration Successful!'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By registering, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
