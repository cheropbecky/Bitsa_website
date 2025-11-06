import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      toast.success("Login successful! (Mocked — backend removed)");
      navigate("/Homepage"); 
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-50" />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"
        animate={{
          y: [0, -15, 0],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
        }}
      />

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(59,130,246,0.3)" }}
      >
        <Card className="w-full max-w-md bg-blue-200 relative shadow-blue-300 shadow-2xl border-blue-100 backdrop-blur-md">
          <CardHeader className="space-y-3 text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
              className="mx-auto w-16 h-16 gradient-blue-primary rounded-2xl flex items-center justify-center shadow-blue-lg mb-2"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-4xl font-bold text-gray-800">Welcome Back</CardTitle>
            <CardDescription className="text-base font-bold">
              Sign in to access your BITSA account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Centered Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-10 w-full rounded-3xl mx-auto gradient-blue-primary hover:opacity-90 transition-all font-bold bg-blue-500 shadow-blue-lg group flex items-center justify-center"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 font-bold">
                Don’t have an account?{" "}
              </p>
            </div>
            <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")} 
                  className="text-white font-bold bg-blue-500 px-4 py-2 rounded-3xl hover:bg-blue-600  transition-all shadow-md hover:shadow-blue-lg mx-24"
                >
                  Create one now
                </motion.button>
            <div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                By signing in, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Login;
