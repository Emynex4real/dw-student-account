import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  let title = 'Oops! Something went wrong.';
  let message = 'An unexpected error occurred. Please try refreshing the page or navigating back.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = '404 - Page Not Found';
      message = "The page you are looking for doesn't exist or has been moved.";
    } else {
      title = `${error.status} - ${error.statusText}`;
      message = error.data?.message || 'An unexpected error occurred.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 max-w-md w-full">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mb-6 text-sm text-gray-500">{message}</p>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full rounded-lg bg-[#f7941d] px-4 py-2 font-medium text-black transition-colors hover:bg-orange-500 hover:text-white"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
