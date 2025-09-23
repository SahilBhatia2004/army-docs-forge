import { LogOut, FileText, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import armyLogo from '@/assets/indian-army-logo.jpg';

interface NavigationProps {
  user: {
    name: string;
    role: 'clerk' | 'officer';
    serviceNumber: string;
  };
  onLogout: () => void;
}

export const Navigation = ({ user, onLogout }: NavigationProps) => {
  const getRoleIcon = () => {
    return user.role === 'officer' ? <Shield className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const getRoleBadgeVariant = () => {
    return user.role === 'officer' ? 'default' : 'secondary';
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img 
              src={armyLogo} 
              alt="Indian Army" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-lg font-semibold command-text text-foreground">
                Indian Army DMS
              </h1>
              <p className="text-xs text-muted-foreground">Document Management System</p>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* User Details */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium command-text text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Service No: {user.serviceNumber}
                </p>
              </div>
              
              <Badge variant={getRoleBadgeVariant()} className="flex items-center space-x-1">
                {getRoleIcon()}
                <span className="capitalize">{user.role}</span>
              </Badge>
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};