import { useState } from "react";
import { toast } from "sonner";

export default function Signup({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signup successful! Please verify your email.");
      onNavigate("login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 px-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 px-3 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => onNavigate("login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
