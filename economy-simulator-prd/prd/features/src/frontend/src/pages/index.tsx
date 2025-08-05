import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import BankSelectionDemo from '../components/BankSelection/BankSelectionDemo';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <BankSelectionDemo />
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
} 