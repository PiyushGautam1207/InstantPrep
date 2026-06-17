import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap, Briefcase, Terminal } from 'lucide-react';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    grad_year: '',
    target_role: 'Full Stack Developer'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    'Software Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'AI/ML Engineer'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await register({
      ...formData,
      grad_year: parseInt(formData.grad_year, 10)
    });

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-darkCard border border-slate-700/50 p-8 rounded-2xl shadow-xl backdrop-blur-md">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 bg-brandIndigo/10 rounded-xl flex items-center justify-center text-brandIndigo mb-3">
            <Terminal size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
          <p className="text-slate-400 text-sm mt-1">Start tracking your placement readiness</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brandIndigo"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brandIndigo"
                placeholder="alex@university.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brandIndigo"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Grid Layout for College Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">College</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  name="college"
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brandIndigo"
                  placeholder="MIT"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">Grad Year</label>
              <input
                type="number"
                name="grad_year"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brandIndigo"
                placeholder="2027"
                value={formData.grad_year}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Target Role Dropdown */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Target Placement Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                name="target_role"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white focus:outline-none focus:border-brandIndigo appearance-none"
                value={formData.target_role}
                onChange={handleChange}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brandIndigo hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-brandIndigo/20 transition-all duration-200 mt-4"
          >
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-slate-400 text-center text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brandIndigo hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}