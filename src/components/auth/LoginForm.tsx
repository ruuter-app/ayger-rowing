import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e?: React.FormEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
    }

    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password) as User;
      // Redirect based on user role
      if (loggedInUser.role === 'coach') {
        navigate('/coach/dashboard');
      } else {
        navigate('/athlete/performance');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'athlete' | 'coach') => {
    const demoEmail = role === 'athlete' ? 'sarah.jones@email.com' : 'coach.thompson@email.com';

    // Set loading state and clear any previous errors
    setLoading(true);
    setError('');

    try {
      // Login directly with demo credentials
      const loggedInUser = await login(demoEmail, 'Ayger2024!') as User;

      // Update form state to show demo credentials
      setEmail(demoEmail);
      setPassword('Ayger2024!');

      // Redirect based on user role
      if (loggedInUser.role === 'coach') {
        navigate('/coach/dashboard');
      } else {
        navigate('/athlete/performance');
      }
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <img 
            src="lovable-uploads/db53a601-301d-4a59-b7e1-c69a1d7b8e76.png" 
            alt="Ayger Logo" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-ayger-navy">Welcome to Ayger</h1>
          <p className="text-muted-foreground">Sign in to your training platform</p>
        </div>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="bg-white text-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="bg-white text-black"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-center text-muted-foreground">Demo Accounts:</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-white text-black border-gray-300" 
                  onClick={() => handleDemoLogin('athlete')}
                >
                  Athlete Demo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-white text-black border-gray-300" 
                  onClick={() => handleDemoLogin('coach')}
                >
                  Coach Demo
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Password: Ayger2024!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}