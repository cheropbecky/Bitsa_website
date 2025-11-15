import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, BookOpen, Calendar as CalendarIcon, Edit, Upload } from 'lucide-react';
import { toast } from 'sonner';

function UserDashboard({ accessToken }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    photo: null,
  });

  const token = accessToken || localStorage.getItem('token');

  useEffect(() => {
    if (token) fetchProfile();
    else {
      toast.error('Please log in to view your dashboard');
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({ email: data.email || '', photo: null });
      } else toast.error('Failed to load profile');
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const payload = new FormData();
    if (formData.email) payload.append('email', formData.email);
    if (formData.photo) payload.append('photo', formData.photo);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else toast.error('Failed to update profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('An error occurred while updating profile');
    }
  };

  if (loading) return <p className="text-center py-12">Loading dashboard...</p>;
  if (!profile) return <p className="text-center py-12">Profile not found</p>;

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-4xl mb-2">My Dashboard</h1>
        <p className="text-xl text-gray-600">Manage your BITSA profile and stay connected</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>View and update your personal details</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ email: profile.email || '', photo: null });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={profile.photo ? `/${profile.photo}` : '/default-avatar.png'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border"
                />
                {isEditing && (
                  <div>
                    <Label htmlFor="photo">Upload New Photo</Label>
                    <Input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={(e) => setFormData((prev) => ({ ...prev, photo: e.target.files[0] }))}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p>{profile.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p>{profile.studentId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Course</p>
                  <p>{profile.course}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Year of Study</p>
                  <p>{profile.year ? `Year ${profile.year}` : 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links & Member Since */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/blogs')}>
                <BookOpen className="w-4 h-4 mr-2" /> Read Blog Posts
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/events')}>
                <CalendarIcon className="w-4 h-4 mr-2" /> View Events
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/gallery')}>
                <User className="w-4 h-4 mr-2" /> Photo Gallery
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member Since</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl">
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
