import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, BookOpen, Calendar as CalendarIcon, Edit } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/api';

function UserDashboard({ accessToken }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ email: '', photo: null, preview: null });

  const token = accessToken || localStorage.getItem('token');

  // Fetch profile
  useEffect(() => {
    if (!token) {
      toast.error('Please log in to view your dashboard');
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.user; // extract user object
      setProfile(user);
      setFormData({
        email: user.email || '',
        photo: null,
        preview: user.photo || '/default-avatar.png',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile updates
  const handleUpdate = async () => {
    const payload = new FormData();
    if (formData.email) payload.append('email', formData.email);
    if (formData.photo) payload.append('photo', formData.photo);

    try {
      const res = await api.put('/users/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = res.data.user;
      setProfile(updatedUser);
      setFormData((prev) => ({
        ...prev,
        preview: updatedUser.photo || '/default-avatar.png',
        photo: null,
      }));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };

  // Handle live photo preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      photo: file,
      preview: URL.createObjectURL(file),
    }));
  };

  if (loading) return <p className="text-center py-12">Loading dashboard...</p>;
  if (!profile) return <p className="text-center py-12">Profile not found</p>;

  return (
    <motion.div
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <div className="mb-8">
    <h1 className="text-4xl text-blue-600 font-bold mb-2 hover:text-blue-800">
      My Dashboard
    </h1>
    <p className="text-xl font-semibold text-gray-600">
      Manage your BITSA profile and stay connected
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Profile Card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="lg:col-span-2"
    >
      <Card className="bg-gray-100 border border-blue-400 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
              <CardDescription>View and update your personal details</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      email: profile.email || '',
                      photo: null,
                      preview: profile.photo || '/default-avatar.png',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={formData.preview || '/default-avatar.png'}
              alt="Profile"
              className="w-20 h-20 rounded-full border border-blue-400"
            />
            {isEditing && (
              <div>
                <Label htmlFor="photo">Upload New Photo</Label>
                <Input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            )}
          </div>

          <div className="space-y-2 p-2 border border-blue-400 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">
            <Label>Email</Label>
            {isEditing ? (
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>

          {/* Profile Details */}
          {['name', 'studentId', 'course', 'year'].map((field, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border border-blue-400 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              {field === 'year' ? (
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              ) : (
                <BookOpen className="w-5 h-5 text-blue-600" />
              )}
              <div>
                <p className="text-sm text-gray-600">
                  {field === 'name'
                    ? 'Full Name'
                    : field === 'studentId'
                    ? 'Student ID'
                    : field === 'course'
                    ? 'Course'
                    : 'Year of Study'}
                </p>
                <p>
                  {profile[field]
                    ? field === 'year'
                      ? `Year ${profile[field]}`
                      : profile[field]
                    : 'Not set'}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>

    {/* Quick Links & Member Since */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      <Card className="bg-blue-300 border border-blue-400 shadow-md rounded-lg hover:shadow-xl hover:scale-105 transition-transform transition-shadow">
        <CardHeader>
          <CardTitle className="font-bold text-blue-600">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/blogs')}
          >
            <BookOpen className="w-4 h-4 text-red-500 mr-2" /> Read Blog Posts
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/events')}
          >
            <CalendarIcon className="w-4 text-blue-600 h-4 mr-2" /> View Events
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/gallery')}
          >
            <User className="w-4 text-amber-600 h-4 mr-2" /> Photo Gallery
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-200 border border-blue-400 shadow-md rounded-lg hover:shadow-xl hover:scale-105 transition-transform transition-shadow">
        <CardHeader>
          <CardTitle className="font-bold text-blue-600">Member Since</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Not available'}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</motion.div>

  );
}

export default UserDashboard;
