import React from 'react';
import { Camera, Shield, Award, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HowItWorks() {
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl font-bold mb-4">How RoadGuard Works</h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
          Join our community in making roads safer. Follow these simple steps to report traffic violations
          and earn rewards while contributing to road safety.
        </p>
      </section>

      {/* Steps Section */}
      <section className="mb-20">
        <div className="grid md:grid-cols-4 gap-8">
          <Step
            number={1}
            icon={<Camera className="w-8 h-8" />}
            title="Capture Evidence"
            description="Take photos or videos of traffic violations using our app's secure camera feature."
          />
          <Step
            number={2}
            icon={<Shield className="w-8 h-8" />}
            title="Submit Report"
            description="Fill in the violation details and location. Our system automatically adds secure geo-tags."
          />
          <Step
            number={3}
            icon={<CheckCircle className="w-8 h-8" />}
            title="Verification"
            description="Our team verifies the report and coordinates with local authorities for action."
          />
          <Step
            number={4}
            icon={<Award className="w-8 h-8" />}
            title="Earn Rewards"
            description="Receive rewards for verified reports, making roads safer for everyone."
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            title="Secure & Anonymous"
            description="Your identity is always protected. We use advanced encryption to ensure your privacy."
            image="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80"
          />
          <Feature
            title="Real-time Tracking"
            description="Monitor the status of your reports and rewards through our user-friendly dashboard."
            image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
          />
          <Feature
            title="Quick Rewards"
            description="Get paid for verified reports through our secure payment system."
            image="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary-900 text-white rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl mb-8">
          Join thousands of citizens who are making our roads safer every day.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors"
        >
          Get Started Now
        </button>
      </section>
    </div>
  );
}

function Step({ number, icon, title, description }: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="relative">
        <div className="inline-block p-4 bg-primary-50 rounded-full mb-4 text-primary-500">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  );
}

function Feature({ title, description, image }: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-secondary-600">{description}</p>
      </div>
    </div>
  );
}