import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useCreateUser, useGetUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplet, ArrowRight, Activity, Hospital, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Mutations & Queries
  const createUserMutation = useCreateUser();

  // Register State
  const [role, setRole] = useState<"donor" | "receiver" | "hospital">("donor");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Not sent to API, just mock
    bloodGroup: "A+",
    location: "",
    pinCode: "",
    hospitalName: "",
    contact: "",
  });

  // Login State
  const [loginUid, setLoginUid] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mockUid = `uid_${Math.random().toString(36).substring(7)}`;
      
      await createUserMutation.mutateAsync({
        data: {
          uid: mockUid,
          name: formData.name,
          email: formData.email,
          role: role,
          bloodGroup: formData.bloodGroup,
          location: formData.location,
          pinCode: formData.pinCode,
          hospitalName: role === "hospital" ? formData.hospitalName : null,
          contact: formData.contact,
        }
      });

      toast({ title: "Registration Successful", description: "Welcome to Jivan Daan!" });
      login(mockUid);
      setLocation(role === "hospital" ? "/hospital-dashboard" : "/");
    } catch (error) {
      toast({ title: "Error", description: "Registration failed. Try again.", variant: "destructive" });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUid.trim()) return;
    setIsLoginLoading(true);
    // Simulate API delay
    setTimeout(() => {
      login(loginUid);
      toast({ title: "Welcome back!" });
      setLocation("/");
      setIsLoginLoading(false);
    }, 800);
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-xl shadow-primary/20 mb-6">
            <Droplet className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome to Jivan Daan</h1>
          <p className="text-muted-foreground mt-2">Join our mission to save lives.</p>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl shadow-xl shadow-black/5 p-6 sm:p-8 backdrop-blur-xl">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1">
              <TabsTrigger value="login" className="rounded-xl data-[state=active]:shadow-sm">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl data-[state=active]:shadow-sm">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-6 text-sm text-primary">
                  <strong>Demo Mode:</strong> Since we are using mock auth, enter any registered Demo UID (or register a new one).
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginUid">Mock UID</Label>
                  <Input 
                    id="loginUid" 
                    placeholder="e.g. uid_demo123" 
                    value={loginUid}
                    onChange={(e) => setLoginUid(e.target.value)}
                    required
                    className="h-12 bg-background/50"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={isLoginLoading}>
                  {isLoginLoading ? "Logging in..." : "Login"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Role Selector */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button type="button" onClick={() => setRole("donor")} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${role === 'donor' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                    <Activity className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">Donor</span>
                  </button>
                  <button type="button" onClick={() => setRole("receiver")} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${role === 'receiver' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                    <UserIcon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">Receiver</span>
                  </button>
                  <button type="button" onClick={() => setRole("hospital")} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${role === 'hospital' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                    <Hospital className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">Hospital</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={formData.name} onChange={e => updateForm("name", e.target.value)} required placeholder="John Doe" className="bg-background/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={e => updateForm("email", e.target.value)} required placeholder="john@example.com" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.bloodGroup}
                      onChange={e => updateForm("bloodGroup", e.target.value)}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City/Location</Label>
                    <Input value={formData.location} onChange={e => updateForm("location", e.target.value)} required placeholder="New York" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>PIN Code</Label>
                    <Input value={formData.pinCode} onChange={e => updateForm("pinCode", e.target.value)} required placeholder="10001" className="bg-background/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input value={formData.contact} onChange={e => updateForm("contact", e.target.value)} required placeholder="+1 234 567 8900" className="bg-background/50" />
                </div>

                {role === "hospital" && (
                  <div className="space-y-2">
                    <Label>Hospital Name</Label>
                    <Input value={formData.hospitalName} onChange={e => updateForm("hospitalName", e.target.value)} required placeholder="City General Hospital" className="bg-background/50" />
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending ? "Creating Account..." : "Create Account"} 
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
