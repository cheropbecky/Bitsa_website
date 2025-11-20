import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import api from '../api/api';

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

    const trimmedPassword = formData.password.trim();
    const trimmedConfirmPassword = formData.confirmPassword.trim();

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const cleanedData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: trimmedPassword,
      studentId: formData.studentId.trim(),
      course: formData.course.trim(),
      year: formData.year,
    };

    try {
      const response = await api.post('/users/register', cleanedData);

      toast.success('Account created successfully!', { duration: 3000 });
      alert('Registration successful! You can now log in.');

      setFormData({
        name: '', email: '', password: '', confirmPassword: '',
        studentId: '', course: '', year: '',
      });
      
      navigate('/login'); 
      
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-blue-300 rounded-2xl shadow-2xl p-8 border border-blue-100"
      >
        <h1 className="text-4xl text-blue-600 font-bold text-center mb-6">Join BITSA</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full h-12 border rounded-md px-3" required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full h-12 border rounded-md px-3" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} className="w-full h-12 border rounded-md px-3" required />
          <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} className="w-full h-12 border rounded-md px-3" required />
          <input type="text" placeholder="Student ID" value={formData.studentId} onChange={(e) => handleChange('studentId', e.target.value)} className="w-full h-12 border rounded-md px-3" />
          <input type="text" placeholder="Course/Program" value={formData.course} onChange={(e) => handleChange('course', e.target.value)} className="w-full h-12 border rounded-md px-3" />
          <select value={formData.year} onChange={(e) => handleChange('year', e.target.value)} className="w-full h-12 border rounded-md px-3">
            <option value="">Year of Study</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>

          <button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 text-white rounded-md font-bold">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Sign in</button>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;