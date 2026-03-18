import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
