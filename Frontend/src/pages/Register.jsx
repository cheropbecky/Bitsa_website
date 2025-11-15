import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    course: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      toast.success(data.message || 'Account created successfully!', { duration: 3000 });

      // ✅ Auto-login
      if (data.token && data.user && onLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update App state
        onLogin(data.user, data.token);

        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          studentId: '',
          course: '',
          year: '',
        });

        // Redirect to homepage
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-blue-200 rounded-2xl shadow-2xl p-8 border border-blue-100"
      >
        <h1 className="text-4xl text-blue-600 font-bold text-center mb-6">Join BITSA</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full h-12 border rounded-md px-3"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full h-12 border rounded-md px-3"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full h-12 border rounded-md px-3"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className="w-full h-12 border rounded-md px-3"
            required
          />
          <input
            type="text"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            className="w-full h-12 border rounded-md px-3"
          />
          <input
            type="text"
            placeholder="Course/Program"
            value={formData.course}
            onChange={(e) => handleChange('course', e.target.value)}
            className="w-full h-12 border rounded-md px-3"
          />
          <select
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full h-12 border rounded-md px-3"
          >
            <option value="">Year of Study</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 text-white rounded-md font-bold"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
