import React, { useState, useCallback } from 'react';
import { getHealthAdvice } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const advice = await getHealthAdvice(prompt);
      setResponse(advice);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setResponse('');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <section className="bg-white rounded-xl shadow-lg border border-slate-200/80">
      <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl text-center">
        <h2 className="text-3xl font-bold text-primary-600">دستیار سلامت هوش مصنوعی</h2>
        <p className="text-slate-500 mt-2">سوالات سلامتی خود را بپرسید و پاسخ‌های فوری دریافت کنید.</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: بهترین راه‌ها برای کاهش استرس چیست؟"
            className="w-full p-4 text-base text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 focus:outline-none resize-none"
            rows={4}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt}
            className="mt-4 w-full bg-primary-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال پردازش...
              </>
            ) : (
              'دریافت پاسخ'
            )}
          </button>
        </form>
        {(response || error) && (
          <div className="mt-6 p-6 border rounded-lg bg-slate-50">
            {error && <p className="text-danger-600 font-semibold">{error}</p>}
            {response && <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{response}</p>}
          </div>
        )}
      </div>
    </section>
  );
};