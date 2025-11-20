const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  studentId: { type: String, default: '' },
  course: { type: String, default: '' },
  year: { type: String, default: '' },
  photo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = this.password.trim(); 
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(password) {
  if (!password) return false;
  
  
  const trimmedPassword = password.trim(); 

  try {
    const normalMatch = await bcrypt.compare(trimmedPassword, this.password);
    if (normalMatch) {
      return true;
    }
    console.log('Password mismatch for user:', this.email);
    console.log('Stored password length:', this.password?.length);
    console.log('Password starts with bcrypt marker:', this.password?.startsWith('$2'));
    
    return false;
  } catch (err) {
    console.error('Error in matchPassword:', err);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);