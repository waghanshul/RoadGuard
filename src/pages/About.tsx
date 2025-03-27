import React from 'react';
import { Shield, Award, Users, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Mission Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Mission</h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            At RoadGuard, we're committed to making roads safer through citizen engagement and cutting-edge technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
              alt="Road safety"
              className="rounded-lg shadow-xl w-full h-[400px] object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Why RoadGuard?</h2>
            <p className="text-secondary-600">
              We believe that road safety is everyone's responsibility. By empowering citizens with the tools to report
              traffic violations, we create a collaborative ecosystem that helps law enforcement and makes our roads safer
              for all.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="font-bold text-3xl text-primary-500">95%</div>
                <div className="text-secondary-600">Resolution Rate</div>
              </div>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="font-bold text-3xl text-primary-500">50K+</div>
                <div className="text-secondary-600">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <ValueCard
            icon={<Shield className="w-8 h-8" />}
            title="Safety First"
            description="We prioritize the safety of all road users through proactive measures."
          />
          <ValueCard
            icon={<Users className="w-8 h-8" />}
            title="Community"
            description="Building a strong community of responsible citizens."
          />
          <ValueCard
            icon={<Target className="w-8 h-8" />}
            title="Innovation"
            description="Using technology to create effective solutions."
          />
          <ValueCard
            icon={<Award className="w-8 h-8" />}
            title="Recognition"
            description="Rewarding citizens who contribute to road safety."
          />
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="inline-block p-3 bg-primary-50 rounded-full mb-4 text-primary-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  );
}
