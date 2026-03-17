import React from 'react';

const FeedbackPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Feedback</h1>
      <p className="text-gray-600 mb-6">
        We would love to hear your thoughts, suggestions, or concerns. Please fill out the form below.
      </p>
      
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
            placeholder="What is this regarding?"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
            placeholder="Enter your feedback here..."
          ></textarea>
        </div>
        
        <div className="pt-2">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackPage;
