import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes and verify admin claim
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Force refresh the token to get the latest custom claims
          const tokenResult = await user.getIdTokenResult(true);
          setIsAdmin(!!tokenResult.claims.admin);
        } catch (error) {
          console.error('Error verifying admin custom claims:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not admin
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render protected content if authenticated and admin
  return <>{children}</>;
}