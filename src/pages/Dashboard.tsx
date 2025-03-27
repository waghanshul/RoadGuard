import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabaseDb } from '../lib/supabase';

type ReportStatus = 'pending' | 'verified' | 'rejected';

interface Report {
  id: string;
  type: string;
  location: string;
  date: string;
  status: ReportStatus;
  reward?: number;
  description: string;
  images: {
    url: string;
    latitude?: number;
    longitude?: number;
  }[];
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'reports' | 'rewards'>('reports');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch reports
        const { data: reportData, error: reportError } = await supabaseDb.getReports(user.id);
          
        if (reportError) throw reportError;
        
        // Fetch images for each report
        const reportsWithImages = await Promise.all(
          reportData.map(async (report) => {
            const { data: imageData, error: imageError } = await supabaseDb.getReportImages(report.id);
              
            if (imageError) throw imageError;
            
            return {
              id: report.id,
              type: report.type,
              location: report.location,
              date: new Date(report.created_at).toLocaleDateString(),
              status: report.status as ReportStatus,
              reward: report.reward,
              description: report.description,
              images: imageData.map(img => ({
                url: img.image_url,
                latitude: img.latitude,
                longitude: img.longitude
              }))
            };
          })
        );
        
        setReports(reportsWithImages);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [user]);

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'verified':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const totalRewards = reports
    .filter(report => report.status === 'verified')
    .reduce((sum, report) => sum + (report.reward || 0), 0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-secondary-600">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.name || 'User'}</h1>
            <p className="text-secondary-600">{profile?.email || user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-primary-500">{reports.length}</div>
            <div className="text-secondary-600">Reports Submitted</div>
          </div>
          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-500">
              {reports.filter(r => r.status === 'verified').length}
            </div>
            <div className="text-secondary-600">Verified Reports</div>
          </div>
          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-primary-500">₹{totalRewards}</div>
            <div className="text-secondary-600">Total Rewards</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'reports'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-secondary-600 hover:bg-secondary-50'
          }`}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'rewards'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-secondary-600 hover:bg-secondary-50'
          }`}
        >
          Rewards
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
          {error}
        </div>
      )}

      {/* Reports List */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-secondary-600 mb-4">You haven't submitted any reports yet.</p>
              <button
                onClick={() => window.location.href = '/report'}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Submit Your First Report
              </button>
            </div>
          ) : (
            reports.map(report => (
              <div key={report.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(report.status)}
                    <div className="text-left">
                      <div className="font-semibold">{report.type}</div>
                      <div className="text-sm text-secondary-600">{report.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={getStatusColor(report.status)}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    {expandedReport === report.id ? (
                      <ChevronUp className="w-5 h-5 text-secondary-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-secondary-400" />
                    )}
                  </div>
                </button>
                
                {expandedReport === report.id && (
                  <div className="px-6 py-4 border-t border-secondary-200">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold mb-2">Details</h3>
                        <div className="space-y-2 text-secondary-600">
                          <p><span className="font-medium">Date:</span> {report.date}</p>
                          <p><span className="font-medium">Description:</span> {report.description}</p>
                          {report.reward && (
                            <p><span className="font-medium">Reward:</span> ₹{report.reward}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Evidence</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {report.images.length > 0 ? (
                            report.images.map((image, index) => (
                              <img
                                key={index}
                                src={image.url}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                            ))
                          ) : (
                            <p className="text-secondary-500 col-span-2">No images available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Rewards List */}
      {activeTab === 'rewards' && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-secondary-200">
            <h2 className="text-xl font-semibold">Reward History</h2>
          </div>
          <div className="divide-y divide-secondary-200">
            {reports
              .filter(report => report.status === 'verified' && report.reward)
              .length > 0 ? (
                reports
                  .filter(report => report.status === 'verified' && report.reward)
                  .map(report => (
                    <div key={report.id} className="p-6 flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{report.type}</div>
                        <div className="text-sm text-secondary-600">{report.date}</div>
                      </div>
                      <div className="text-lg font-semibold text-green-500">
                        +₹{report.reward}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center text-secondary-600">
                  No rewards yet. Verified reports are eligible for rewards.
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}