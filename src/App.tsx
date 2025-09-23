import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import { Navigation } from "./components/layout/Navigation";
import { ClerkDashboard } from "./components/clerk/ClerkDashboard";
import { OfficerDashboard } from "./components/officer/OfficerDashboard";

const queryClient = new QueryClient();

interface User {
  name: string;
  email: string;
  role: 'clerk' | 'officer';
  serviceNumber: string;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleLogin = async (email: string, password: string, role: 'clerk' | 'officer') => {
    // TODO: Integrate with Supabase authentication
    // Mock user for demonstration
    const mockUser: User = {
      name: role === 'officer' ? 'Major Rajesh Kumar' : 'Clerk Vijay Singh',
      email,
      role,
      serviceNumber: role === 'officer' ? 'IC-56789' : 'JCO-12345',
    };
    setUser(mockUser);
  };

  const handleSignup = async (
    email: string, 
    password: string, 
    role: 'clerk' | 'officer', 
    name: string, 
    serviceNumber: string
  ) => {
    // TODO: Integrate with Supabase authentication
    // Mock user creation for demonstration
    const newUser: User = {
      name,
      email,
      role,
      serviceNumber,
    };
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthMode('login');
  };

  // If user is logged in, show the appropriate dashboard
  if (user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Navigation user={user} onLogout={handleLogout} />
            <main>
              {user.role === 'clerk' ? (
                <ClerkDashboard />
              ) : (
                <OfficerDashboard />
              )}
            </main>
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show authentication forms
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {authMode === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToSignup={() => setAuthMode('signup')}
            />
          ) : (
            <SignupForm
              onSignup={handleSignup}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
