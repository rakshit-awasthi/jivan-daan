import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useCreateUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplet, ArrowRight, Activity, Hospital, User as UserIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Google Sign-in Modal — simulates a Google OAuth popup
function GoogleSigninModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (uid: string, role: "donor" | "receiver" | "hospital") => void;
}) {
  const createUserMutation = useCreateUser();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<"donor" | "receiver" | "hospital">("donor");
  const [step, setStep] = useState<"account" | "details">("account");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setStep("details");
  };

  const handleGoogleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mockUid = `google_${email.replace(/[^a-z0-9]/gi, "_")}_${Math.random().toString(36).substring(2, 6)}`;
      await createUserMutation.mutateAsync({
        data: {
          uid: mockUid,
          name,
          email,
          role,
          bloodGroup,
          location,
          pinCode: "",
          hospitalName: null,
          contact: null,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff&bold=true`,
        },
      });
      toast({ title: "Signed in with Google!", description: `Welcome, ${name}!` });
      onSuccess(mockUid, role);
    } catch {
      toast({ title: "Error", description: "Google sign-in failed. Try again.", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <GoogleIcon />
            <span className="text-sm text-muted-foreground font-medium">Sign in with Google</span>
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            {step === "account" ? "Choose an account" : "Complete your profile"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {step === "account" ? "to continue to Jivan Daan" : "Just a few more details"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "account" ? (
            <motion.form
              key="account"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleNext}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Google Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  required
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full font-semibold">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleGoogleCreate}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-2 mb-2">
                {(["donor", "receiver", "hospital"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all text-xs font-semibold capitalize ${
                      role === r
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {r === "donor" && <Activity className="w-4 h-4 mb-1" />}
                    {r === "receiver" && <UserIcon className="w-4 h-4 mb-1" />}
                    {r === "hospital" && <Hospital className="w-4 h-4 mb-1" />}
                    {r}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>City / Location</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  required
                  className="bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep("account")} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1 font-semibold" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function Auth() {
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const createUserMutation = useCreateUser();

  const [role, setRole] = useState<"donor" | "receiver" | "hospital">("donor");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "A+",
    location: "",
    pinCode: "",
    hospitalName: "",
    contact: "",
  });

  const [loginEmail, setLoginEmail] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mockUid = `uid_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await createUserMutation.mutateAsync({
        data: {
          uid: mockUid,
          name: formData.name,
          email: formData.email,
          role,
          bloodGroup: formData.bloodGroup,
          location: formData.location,
          pinCode: formData.pinCode,
          hospitalName: role === "hospital" ? formData.hospitalName : null,
          contact: formData.contact,
        },
      });
      toast({ title: "Registration Successful!", description: `Welcome to Jivan Daan, ${formData.name}!` });
      login(mockUid);
      setLocation(role === "hospital" ? "/hospital-dashboard" : "/");
    } catch {
      toast({ title: "Error", description: "Registration failed. Try again.", variant: "destructive" });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    setIsLoginLoading(true);
    setTimeout(() => {
      login(loginEmail);
      toast({ title: "Welcome back!" });
      setLocation("/");
      setIsLoginLoading(false);
    }, 800);
  };

  const handleGoogleSuccess = (uid: string, role: "donor" | "receiver" | "hospital") => {
    setShowGoogleModal(false);
    login(uid);
    setLocation(role === "hospital" ? "/hospital-dashboard" : "/");
  };

  const updateForm = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />

      <AnimatePresence>
        {showGoogleModal && (
          <GoogleSigninModal
            onClose={() => setShowGoogleModal(false)}
            onSuccess={handleGoogleSuccess}
          />
        )}
      </AnimatePresence>

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
          {/* Google Sign-In button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-border bg-background hover:bg-muted/50 hover:border-primary/30 transition-all font-medium text-foreground mb-6 group"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1">
              <TabsTrigger value="login" className="rounded-xl data-[state=active]:shadow-sm">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl data-[state=active]:shadow-sm">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary/80">
                  <strong>Demo:</strong> Enter your registered UID to login, or use Google sign-in above.
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Your UID</Label>
                  <Input
                    id="loginEmail"
                    placeholder="uid_abc123..."
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
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
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Role Selector */}
                <div className="grid grid-cols-3 gap-3 mb-2">
                  {(["donor", "receiver", "hospital"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all capitalize ${
                        role === r
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {r === "donor" && <Activity className="w-5 h-5 mb-1" />}
                      {r === "receiver" && <UserIcon className="w-5 h-5 mb-1" />}
                      {r === "hospital" && <Hospital className="w-5 h-5 mb-1" />}
                      <span className="text-xs font-semibold capitalize">{r}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={formData.name} onChange={(e) => updateForm("name", e.target.value)} required placeholder="John Doe" className="bg-background/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} required placeholder="john@example.com" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.bloodGroup}
                      onChange={(e) => updateForm("bloodGroup", e.target.value)}
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City / Location</Label>
                    <Input value={formData.location} onChange={(e) => updateForm("location", e.target.value)} required placeholder="Mumbai" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>PIN Code</Label>
                    <Input value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value)} placeholder="400001" className="bg-background/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input value={formData.contact} onChange={(e) => updateForm("contact", e.target.value)} placeholder="+91 98765 43210" className="bg-background/50" />
                </div>

                {role === "hospital" && (
                  <div className="space-y-2">
                    <Label>Hospital Name</Label>
                    <Input value={formData.hospitalName} onChange={(e) => updateForm("hospitalName", e.target.value)} required placeholder="City General Hospital" className="bg-background/50" />
                  </div>
                )}

                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
