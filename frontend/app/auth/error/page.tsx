'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = "force-dynamic";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200 text-center">
      <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Authentication Error</h1>
      <p className="text-slate-600 mt-4 mb-8">
        {error === 'Configuration' && 'There is a problem with the server configuration (Check environment variables).'}
        {error === 'AccessDenied' && 'Access was denied. You may not have permission to log in.'}
        {error === 'Verification' && 'The verification link has expired or has already been used.'}
        {!error && 'An unexpected error occurred during authentication.'}
        {error && !['Configuration', 'AccessDenied', 'Verification'].includes(error) && `Error code: ${error}`}
      </p>
      <div className="flex flex-col gap-3">
        <Link href="/auth/signin" className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition-colors">
          Try again
        </Link>
        <Link href="/" className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthErrorContent />
      </Suspense>
    </main>
  );
}
