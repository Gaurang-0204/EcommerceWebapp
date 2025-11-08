/**File:** `src/components/Performance/ErrorBoundary.jsx`

/**
 * @fileoverview Error Boundary Component
 * Catches React errors and provides fallback UI
 * Prevents entire app crash from component errors
 */

import React from 'react';
import react from  'react'

class ErrorBoundary extends React.Component{
    constructor(props){
        super(props);
        this.state={
            hasError:false,
            error:null,
            errorInfo:null 
        };
    }

    static getDerivedStateFromError(error){
        return {hasError : true}
    }

    componentDidCatch(error, errorInfo){
        //Log error to monitoring service eg = sentry 
        console.error('Error Boundary caught an error : ', error , errorInfo)

        this.setState({
            error,
            errorInfo
        });

        // TODO: Send to error tracking service
        // if (window.Sentry) {
       //   window.Sentry.captureException(error, { extra: errorInfo });
       // }


    }

    handleReset = () => {
        this.setState({
            hasError:false,
            error:null,
            errorInfo: null
        });
    };


    render () {
        if(this.state.hasError){
           // Custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <svg 
                className="mx-auto h-12 w-12 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                Oops! Something went wrong
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                We're sorry for the inconvenience. Please try refreshing the page.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      ); 
        }

        return this.props.children;
    }

}

export default ErrorBoundary;
