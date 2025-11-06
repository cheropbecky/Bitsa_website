import { useState } from "react";

export default function AdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAdmin = async () => {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
    });

    if (error) alert("Error: " + error.message);
    else alert("Admin created successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Create Admin User</h1>
      <input
        type="email"
        placeholder="Admin email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded mb-2 w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-2 w-64"
      />
      <button
        onClick={handleCreateAdmin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Admin
      </button>
    </div>
  );
}
