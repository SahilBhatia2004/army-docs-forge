import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthLayout } from './AuthLayout';
import { useToast } from '@/hooks/use-toast';

interface SignupFormProps {
  onSignup: (email: string, password: string, role: 'clerk' | 'officer', name: string, serviceNumber: string) => void;
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSignup, onSwitchToLogin }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'clerk' as 'clerk' | 'officer',
    serviceNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.serviceNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrate with Supabase authentication
      await onSignup(formData.email, formData.password, formData.role, formData.name, formData.serviceNumber);
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AuthLayout
      title="Create Account"
      description="Register for Document Management System access"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            value={formData.role} 
            onValueChange={(value: 'clerk' | 'officer') => updateFormData('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clerk">Clerk</SelectItem>
              <SelectItem value="officer">Officer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            required
            className="bg-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceNumber">Service Number</Label>
          <Input
            id="serviceNumber"
            type="text"
            placeholder="Enter your service number"
            value={formData.serviceNumber}
            onChange={(e) => updateFormData('serviceNumber', e.target.value)}
            required
            className="bg-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your official email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
            className="bg-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            required
            className="bg-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            required
            className="bg-input"
          />
        </div>

        <Button
          type="submit"
          className="w-full military-badge"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-primary hover:text-primary-hover underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};