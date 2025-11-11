import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, BookOpen, Calendar, Hash } from 'lucide-react';

function Register({ onNavigate }) {
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: formData.name,
            student_id: formData.studentId,
            course: formData.course,
            year: formData.year,
          },
        ]);

      if (profileError) {
        toast.error(profileError.message);
        setLoading(false);
        return;
      }

      toast.success('Registration successful! Please check your email to verify.');
      onNavigate('login');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-blue-mesh" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 80,
          damping: 15,
        }}
        className="w-full max-w-3xl bg-blue-200 rounded-2xl shadow-2xl p-8 border border-blue-100 relative"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl text-blue-600 font-bold text-center mb-6 flex items-center justify-center gap-3"
        >
          Join BITSA
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div>
            <label className="block text-gray-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="pl-10 h-12 w-full border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-10 h-12 w-full border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Password </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="pl-10 h-12 w-full border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="pl-10 h-12 w-full border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Student ID</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter student ID"
                value={formData.studentId}
                onChange={(e) => handleChange('studentId', e.target.value)}
                className="pl-10 h-12 w-full border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Course/Program</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Software Engineering"
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                className="pl-10 h-12 w-full border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Year of Study</label>
            <div className="relative">
              <select
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="pl-10 h-12 w-full border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Select your year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 text-white rounded-md font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center text-gray-700"
        >
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign in
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Register;
