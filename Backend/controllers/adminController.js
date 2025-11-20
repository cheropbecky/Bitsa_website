const User = require('../models/User');
const Event = require('../models/Event');
const Blog = require('../models/Blog');
const Gallery = require('../models/Gallery');
const Registration = require('../models/Registration');

exports.getDashboardMetrics = async (req, res) => {
  try {
    const [totalUsers, totalBlogs, totalGallery, totalEvents] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Gallery.countDocuments(),
      Event.countDocuments()
    ]);

    const pendingRegistrations = await Registration.countDocuments({ status: 'Pending' });
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'Ongoing' });
    const pastEvents = await Event.countDocuments({ status: 'Past' });

    res.json({
      metrics: {
        totalUsers,
        totalBlogs,
        totalGallery,
        totalEvents,
        pendingRegistrations,
        eventsByStatus: {
          upcoming: upcomingEvents,
          ongoing: ongoingEvents,
          past: pastEvents
        }
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard metrics:', err);
    res.status(500).json({ message: 'Server error fetching metrics', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ 
      count: users.length, 
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        course: user.course,
        year: user.year,
        role: user.role,
        photo: user.photo,
        createdAt: user.createdAt
      }))
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users', error: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user._id.toString() === req.admin.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await Registration.deleteMany({ user: req.params.id });
    await Event.updateMany(
      { registeredUsers: req.params.id },
      { $pull: { registeredUsers: req.params.id } }
    );

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error deleting user', error: err.message });
  }
};


exports.getAllRegistrations = async (req, res) => {
  try {
    const { status, eventId } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (eventId) filter.event = eventId;

    const registrations = await Registration.find(filter)
      .populate('user', 'name email studentId course year')
      .populate('event', 'title description date location status')
      .populate('reviewedBy', 'name email')
      .sort({ registeredAt: -1 });

    res.json({ 
      count: registrations.length, 
      registrations 
    });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ message: 'Server error fetching registrations', error: err.message });
  }
};
