import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/Chatbot";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import FindDonor from "@/pages/FindDonor";
import RequestBlood from "@/pages/RequestBlood";
import Donate from "@/pages/Donate";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import HospitalDashboard from "@/pages/HospitalDashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/find-donor" component={FindDonor} />
          <Route path="/request" component={RequestBlood} />

          <Route path="/donate">
            <ProtectedRoute><Donate /></ProtectedRoute>
          </Route>

          <Route path="/profile">
            <ProtectedRoute><Profile /></ProtectedRoute>
          </Route>

          <Route path="/edit-profile">
            <ProtectedRoute><EditProfile /></ProtectedRoute>
          </Route>

          <Route path="/hospital-dashboard">
            <ProtectedRoute requiredRole="hospital"><HospitalDashboard /></ProtectedRoute>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </AuthProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
