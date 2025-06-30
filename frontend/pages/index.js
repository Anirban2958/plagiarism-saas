// =====================
// Main Page: Plagiarism Checker UI (Next.js)
// =====================
// This file implements the main UI for the plagiarism checker SaaS frontend.
// It includes all UI components, state management, and API integration.

import { useState, useRef } from 'react';

// =====================
// Tooltip Component
// =====================
// Shows a tooltip when hovering/focusing on an info icon.
function Tooltip({ text, children }) {
  return (
    <span className="relative group cursor-pointer" tabIndex={0} aria-label={text} role="tooltip">
      {children}
      <span
        className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg"
        role="tooltip"
        aria-live="polite"
        style={{ color: '#fff', backgroundColor: '#222', outline: 'none' }}
      >
        {text}
      </span>
    </span>
  );
}

// =====================
// Toast Notification Component
// =====================
// Displays a notification for success or error messages.
function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white transition-opacity duration-300 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button
        className="ml-4 text-white font-bold focus:outline-none"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

// =====================
// Spinner Component
// =====================
// Shows a loading spinner while waiting for API response.
function Spinner() {
  return (
    <div className="flex justify-center items-center mt-6" aria-label="Loading">
      <svg className="animate-spin h-8 w-8 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
  );
}

// =====================
// Main Home Component
// =====================
export default function Home() {
  // State for user input, result from backend, loading status, toast, and dark mode
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [darkMode, setDarkMode] = useState(false);
  const resultRef = useRef(null);

  // Handle the plagiarism check button click
  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setToast({ message: 'Please enter some text first.', type: 'error' });
      return;
    }
    setLoading(true);
    setToast(null);
    try {
      // Send the text to the backend API for plagiarism checking
      const response = await fetch('http://127.0.0.1:8080/api/check-plagiarism', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }
      const data = await response.json();
      setResult(data);
      setToast({ message: 'Analysis complete!', type: 'success' });
    } catch (error) {
      console.error(error);
      setToast({ message: 'Upload failed.', type: 'error' });
    }
    setLoading(false);
  };

  // Copy results to clipboard
  const handleCopyResults = () => {
    if (!result) return;
    let text = `Plagiarism Checker Results\n\n`;
    text += `Input: ${result.full_text}\n`;
    if (result.fragment_matches.length === 0) {
      text += `No Plagiarism Detected!`;
    } else {
      text += `Plagiarism Found: ${Math.round((result.fragment_matches.length / (result.full_text.split(/[.!?]/).length || 1)) * 100)}%\n`;
      text += `Sources:\n`;
      result.fragment_matches.forEach((frag, idx) => {
        text += `- Matched: ${frag.matched_sentence}\n  Your Text: ${frag.user_sentence}\n  Similarity: ${Math.round(frag.similarity * 100)}%\n  Source: ${frag.source}${frag.title ? ` (${frag.title})` : ''}${frag.url ? ` [${frag.url}]` : ''}\n`;
      });
    }
    navigator.clipboard.writeText(text);
    setToast({ message: 'Results copied to clipboard!', type: 'success' });
  };

  // Fade-in animation utility
  const fadeInClass = "transition-opacity duration-700 opacity-0 animate-fadein";

  // =====================
  // Main UI Layout
  // =====================
  return (
    <div className={
      `${darkMode ? 'dark' : ''} min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-500 flex items-center justify-center p-4 font-sans`
    } role="main">
      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className={
        `bg-white/95 dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-2xl sm:max-w-3xl border border-gray-200 dark:border-gray-700`
      } aria-label="Plagiarism Checker Main Container">
        {/* Header and dark mode toggle */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-800 dark:text-indigo-200 tracking-tight" id="main-title">
            Plagiarism Checker
          </h1>
          <button
            className="ml-4 px-3 py-1 rounded-lg border border-indigo-400 dark:border-indigo-200 bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-indigo-200 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setDarkMode(dm => !dm)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
        {/* Text input area and button */}
        <div className="flex flex-col items-center gap-4 w-full">
          <textarea
            className="w-full h-36 sm:h-40 p-4 border border-gray-400 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-base sm:text-lg transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Paste or type your text here..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            aria-label="Text to check for plagiarism"
            aria-describedby="main-title"
            style={{ color: darkMode ? '#f3f4f6' : '#222', backgroundColor: darkMode ? '#18181b' : '#f9fafb' }}
          />
          <button
            className="bg-indigo-700 hover:bg-indigo-900 text-white font-semibold py-2 px-8 rounded-xl transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading}
            aria-label="Check text for plagiarism"
          >
            Analyze
          </button>
        </div>
        {/* Loading spinner below the Analyze section */}
        {loading && <Spinner />}
        {/* Results section */}
        {result && (
          <>
            {/* Summary Card */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col items-center shadow">
                <span className="text-xs text-gray-500 font-semibold mb-1">Total Sentences</span>
                <span className="text-2xl font-bold text-indigo-700">{result.full_text.split(/[.!?]/).filter(s => s.trim().length > 0).length}</span>
              </div>
              <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center shadow">
                <span className="text-xs text-gray-500 font-semibold mb-1">Unique</span>
                <span className="text-2xl font-bold text-green-700">{result.full_text.split(/[.!?]/).filter(s => s.trim().length > 0).length - result.fragment_matches.length}</span>
              </div>
              <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-center shadow">
                <span className="text-xs text-gray-500 font-semibold mb-1">Plagiarized</span>
                <span className="text-2xl font-bold text-red-700">{result.fragment_matches.length}</span>
              </div>
            </div>
            {/* Results details and copy button */}
            <div className={`mt-8 ${fadeInClass}`} style={{ animation: 'fadein 0.7s forwards' }} ref={resultRef}>
              <div className="flex justify-end mb-4">
                <button
                  className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-1 px-4 rounded-lg transition duration-200 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={handleCopyResults}
                  aria-label="Copy results to clipboard"
                >
                  Copy Results
                </button>
              </div>
              {/* Uploaded text section */}
              <h2 className="text-2xl font-bold mb-2 text-indigo-700 flex items-center gap-2">
                Uploaded Text
                <Tooltip text="This is the text you submitted for plagiarism checking.">
                  <span className="ml-1 text-gray-400 text-base align-middle">&#9432;</span>
                </Tooltip>
              </h2>
              {/* Highlight plagiarized fragments in the user's text */}
              <HighlightedText text={result.full_text} matches={result.fragment_matches} />
              {/* Plagiarism result summary */}
              <h2 className="text-2xl font-bold mb-2 text-indigo-700 flex items-center gap-2">
                Plagiarism Result
                <Tooltip text="Shows the percentage of your text that matches known sources.">
                  <span className="ml-1 text-gray-400 text-base align-middle">&#9432;</span>
                </Tooltip>
              </h2>
              {result.fragment_matches.length === 0 ? (
                <p className="text-green-600 font-semibold text-lg flex items-center"><span className="text-2xl mr-2">✅</span> No Plagiarism Detected!</p>
              ) : (
                <div>
                  <p className="text-red-600 font-semibold text-lg flex items-center"><span className="text-2xl mr-2">❌</span> Plagiarism Found:</p>
                  <div className="mt-4">
                    {/* Plagiarism/Unique percentage summary with tooltips */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8">
                      <div className="mb-4 sm:mb-0 flex items-center gap-2">
                        <span className="text-4xl font-bold text-red-600">{Math.round((result.fragment_matches.length / (result.full_text.split(/[.!?]/).length || 1)) * 100)}%</span>
                        <Tooltip text="Percentage of your sentences/fragments that match known sources.">
                          <span className="text-gray-400 text-base align-middle">&#9432;</span>
                        </Tooltip>
                        <span className="ml-2 text-lg font-bold" style={{ color: '#fff', textShadow: '0 1px 2px #b91c1c' }}>Plagiarism</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-green-600">{100 - Math.round((result.fragment_matches.length / (result.full_text.split(/[.!?]/).length || 1)) * 100)}%</span>
                        <Tooltip text="Percentage of your text that is unique.">
                          <span className="text-gray-400 text-base align-middle">&#9432;</span>
                        </Tooltip>
                        <span className="ml-2 text-lg font-bold" style={{ color: '#fff', textShadow: '0 1px 2px #059669' }}>Unique</span>
                      </div>
                    </div>
                    {/* List of sources and details for each match */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2 text-indigo-700 flex items-center gap-2">
                        Sources
                        <Tooltip text="Where the matched text was found (Wikipedia, Gutenberg, NewsAPI, etc.)">
                          <span className="ml-1 text-gray-400 text-base align-middle">&#9432;</span>
                        </Tooltip>
                      </h3>
                      <ol className="list-decimal list-inside space-y-4">
                        {result.fragment_matches.map((frag, idx) => (
                          <li key={idx} className="bg-red-50 border-l-4 border-red-400 p-4 rounded flex flex-col gap-1">
                            <div className="mb-1">
                              <span className="font-bold">Matched Text:</span> <span className="text-gray-800">{frag.matched_sentence}</span>
                            </div>
                            <div className="mb-1">
                              <span className="font-bold">Your Text:</span> <span className="text-gray-800">{frag.user_sentence}</span>
                            </div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-bold">Similarity:</span> <span className="text-indigo-700 font-semibold">{Math.round(frag.similarity * 100)}%</span>
                              <Tooltip text="How similar your fragment is to the matched source (100% = identical)">
                                <span className="text-gray-400 text-base align-middle">&#9432;</span>
                              </Tooltip>
                            </div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-bold">Source:</span> <span className="text-blue-700">{frag.source}</span>{frag.title && <span className="ml-2 text-gray-600">({frag.title})</span>}
                              {frag.url && (
                                <a href={frag.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 underline">View Source</a>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* Global styles for fade-in animation and dark mode background */}
      <style jsx global>{`
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadein {
          opacity: 0;
          animation: fadein 0.7s forwards;
        }
        .dark {
          background: linear-gradient(135deg, #18181b 0%, #312e81 100%) !important;
        }
      `}</style>
    </div>
  );
}

// =====================
// HighlightedText Component
// =====================
// Highlights plagiarized fragments in the user's text using <mark> tags.
function HighlightedText({ text, matches }) {
  if (!matches || matches.length === 0) {
    return <p className="bg-gray-50 p-4 rounded-xl mb-4 max-h-60 overflow-y-auto whitespace-pre-wrap text-gray-900" aria-label="Submitted text">{text}</p>;
  }
  // Sort matches by user_sentence length (longest first) to avoid nested highlights
  const sorted = [...matches].sort((a, b) => b.user_sentence.length - a.user_sentence.length);
  let marked = text;
  sorted.forEach((frag, idx) => {
    const re = new RegExp(frag.user_sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    marked = marked.replace(re, `<mark style=\"background: #fde68a; color: #b91c1c; padding:2px 4px; border-radius:4px;\">${frag.user_sentence}</mark>`);
  });
  return (
    <div className="bg-gray-50 p-4 rounded-xl mb-4 max-h-60 overflow-y-auto whitespace-pre-wrap text-gray-900" aria-label="Highlighted plagiarized text" dangerouslySetInnerHTML={{ __html: marked }} />
  );
}