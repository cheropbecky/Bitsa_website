import { useEffect, useState } from "react";
export default function UserDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => setUser(data.session?.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.email || "User"}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
