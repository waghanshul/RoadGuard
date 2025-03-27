import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Award, UserCheck, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/report');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-secondary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Making Roads Safer
                <span className="text-primary-500"> Together</span>
              </h1>
              <p className="text-xl text-secondary-300">
                Join our community in promoting road safety through citizen engagement and modern technology.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/how-it-works')}
                  className="px-8 py-4 bg-secondary-800 hover:bg-secondary-700 rounded-lg font-semibold transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <Shield className="w-full h-full text-primary-500 opacity-10 absolute" />
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80"
                alt="Safe driving"
                className="rounded-lg shadow-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How RoadGuard Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<UserCheck className="w-8 h-8 text-primary-500" />}
              title="Easy Reporting"
              description="Report traffic violations quickly and securely through our user-friendly platform."
            />
            <FeatureCard
              icon={<Lock className="w-8 h-8 text-primary-500" />}
              title="Privacy Protected"
              description="Your identity is always protected. We ensure complete anonymity for all reporters."
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-primary-500" />}
              title="Earn Rewards"
              description="Get rewarded for your contribution to making roads safer for everyone."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="10,000+" label="Reports Submitted" />
            <StatCard number="₹5M+" label="Rewards Given" />
            <StatCard number="95%" label="Resolution Rate" />
            <StatCard number="50,000+" label="Active Users" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{number}</div>
      <div className="text-secondary-300">{label}</div>
    </div>
  );
}