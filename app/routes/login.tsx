import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/admin");
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-4 text-xl">T</div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-slate-500 mt-2">Login to manage your SEO empire.</p>
        </div>

        <Card>
          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 ml-1">Email Address</label>
                <Input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@theseofly.com"
                  icon={<Mail className="w-5 h-5" />}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 ml-1">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</Link>
                </div>
                <Input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base"
                isLoading={loading}
              >
                Sign In
                {!loading && <ArrowRight className="w-5 h-5 ml-1" />}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Contact Support</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
