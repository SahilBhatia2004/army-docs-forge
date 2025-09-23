import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import armyLogo from '@/assets/indian-army-logo.jpg';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={armyLogo} 
              alt="Indian Army" 
              className="h-20 w-auto"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold command-text text-foreground">
              Indian Army
            </h1>
            <p className="text-sm text-muted-foreground">
              Document Management System
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="document-card">
          <CardHeader className="text-center">
            <CardTitle className="text-xl command-text">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Secure Document Management System</p>
          <p className="mt-1">Indian Army • Confidential</p>
        </div>
      </div>
    </div>
  );
};