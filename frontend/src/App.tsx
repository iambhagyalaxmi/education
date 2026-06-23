import { useState } from 'react';
import ChatWidget from './components/ChatWidget';
import TicketDashboard from './components/TicketDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AuthLogin from './components/AuthLogin';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl px-4">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Education Portal</h1>
            <p className="mt-2 text-lg text-gray-600">Manage your student support seamlessly.</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Sign out
          </button>
        </header>

        <main className="space-y-8">
          <AnalyticsDashboard />
          <TicketDashboard />
        </main>
      </div>

      <ChatWidget />
    </div>
  )
}
