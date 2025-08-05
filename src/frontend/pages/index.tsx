import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to bank selection page
    router.push('/BankSelection');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Economy Simulator</h1>
        <p className="text-gray-600">Redirecting to Bank Selection...</p>
      </div>
    </div>
  );
};

export default HomePage;
