import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Is my identity protected?",
    answer: "Yes, absolutely! Your personal information is encrypted and never shared with the public. Only authorized law enforcement officials have access to report details, and your identity remains confidential."
  },
  {
    question: "How are violations verified?",
    answer: "Our team of experts reviews each report, including photo/video evidence and location data. We use advanced verification techniques and coordinate with local authorities to ensure accuracy."
  },
  {
    question: "Do I get paid for reporting violations?",
    answer: "Yes! Verified reports are eligible for rewards. The reward amount varies based on the type and severity of the violation. Payments are processed securely through our platform."
  },
  {
    question: "How do geo-tags work?",
    answer: "When you submit a report, our app automatically captures the location data (with your permission). This helps authorities verify the incident and take appropriate action."
  },
  {
    question: "What types of violations can I report?",
    answer: "You can report various traffic violations including signal breaking, illegal parking, rash driving, underage driving, and drunk driving. Each category has specific guidelines for evidence collection."
  },
  {
    question: "How long does verification take?",
    answer: "Most reports are verified within 48-72 hours. Complex cases might take longer. You can track the status of your reports in real-time through your dashboard."
  },
  {
    question: "What happens after a violation is verified?",
    answer: "Verified violations are forwarded to local law enforcement for action. Once processed, you'll receive a notification and any applicable reward will be credited to your account."
  },
  {
    question: "How do I collect my rewards?",
    answer: "Rewards are automatically credited to your RoadGuard wallet once a report is verified. You can transfer the amount to your bank account through our secure payment system."
  }
];

export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-secondary-600">
          Find answers to common questions about RoadGuard
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="mt-12 p-6 bg-secondary-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
        <p className="text-secondary-600 mb-4">
          Can't find the answer you're looking for? Please contact our support team.
        </p>
        <button
          onClick={() => window.location.href = 'mailto:support@roadguard.com'}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-secondary-200 rounded-lg">
      <button
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-secondary-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-left">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-secondary-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-secondary-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-secondary-200">
          <p className="text-secondary-600">{answer}</p>
        </div>
      )}
    </div>
  );
}