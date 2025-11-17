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
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make API call to backend for authentication
      const response = await fetch("http://localhost:5500/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token securely
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("isAdmin", "true");
        toast.success("Welcome, Admin!");
        navigate("/admindashboard");
      } else {
        toast.error(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-50" />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
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

      {/* Admin Card */}
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
              className="mx-auto w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-blue-lg mb-2"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Admin Login
            </CardTitle>
            <CardDescription className="text-base font-semibold text-gray-700">
              Access the BITSA Admin Dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@bitsa.com"
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
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-10 w-full rounded-3xl bg-blue-600 text-white font-bold shadow-blue-lg hover:bg-blue-700 transition-all flex items-center justify-center group"
                >
                  {loading ? "Verifying..." : "Login as Admin"}
                  {!loading && (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>
                Only authorized administrators may access this area.{" "}
                <a href="/" className="text-blue-600 hover:underline">
                  Return to user login
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminLogin;