import React, { useState } from 'react';
import { Camera, MapPin, AlertTriangle, Upload, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseDb } from '../lib/supabase';

const violationTypes = [
  'Signal Breaking',
  'Illegal Parking',
  'Rash Driving',
  'Underage Driving',
  'Drunk Driving'
] as const;

interface ImageWithLocation {
  file: File;
  url: string;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export default function Report() {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageWithLocation[]>([]);
  const [type, setType] = useState<typeof violationTypes[number]>(violationTypes[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      // Get current location
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const newImages = Array.from(files).map(file => ({
        file,
        url: URL.createObjectURL(file),
        location: {
          latitude,
          longitude,
          timestamp: new Date().toISOString()
        }
      }));

      setImages(prev => [...prev, ...newImages]);
      setLocationError('');
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Unable to get location. Please enable location services and try again.');
      
      // Still allow image upload without location if user prefers
      const newImages = Array.from(files).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    if (!user) {
      setSubmitError('You must be logged in to submit a report');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Get current location for the report if not already set
      let reportLocation = location;
      if (!reportLocation) {
        try {
          const position = await getCurrentPosition();
          reportLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
        } catch (error) {
          console.error('Error getting location for report:', error);
        }
      }

      // 1. Create the report
      const { data: report, error: reportError } = await supabaseDb.createReport({
        user_id: user.id,
        type,
        location: reportLocation,
        description,
        status: 'pending'
      });
        
      if (reportError) throw reportError;
      
      // 2. Upload images and create image records
      if (images.length > 0) {
        const imagePromises = images.map(async (image) => {
          const imageUrl = await supabaseDb.uploadImage(user.id, image.file);
          
          return supabaseDb.createReportImage({
            report_id: report.id,
            image_url: imageUrl,
            latitude: image.location?.latitude,
            longitude: image.location?.longitude
          });
        });
        
        await Promise.all(imagePromises);
      }
      
      // Reset form
      setImages([]);
      setType(violationTypes[0]);
      setDescription('');
      setLocation('');
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Failed to submit report:', error);
      setSubmitError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report a Violation</h1>
        <p className="text-secondary-600">
          Help make roads safer by reporting traffic violations. Your identity will remain protected.
        </p>
      </div>

      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Report Submitted Successfully!</h2>
          <p className="text-green-700 mb-6">
            Thank you for contributing to road safety. Your report has been received and will be reviewed shortly.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{submitError}</p>
            </div>
          )}
          
          {/* Image Upload */}
          <div>
            <label className="block text-lg font-semibold mb-4">
              Upload Photos/Videos
            </label>
            {locationError && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                <p className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {locationError}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square group">
                  <img
                    src={image.url}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {image.location && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <p>Lat: {image.location.latitude.toFixed(6)}</p>
                      <p>Long: {image.location.longitude.toFixed(6)}</p>
                    </div>
                  )}
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-square border-2 border-dashed border-secondary-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload className="w-8 h-8 text-secondary-400 mb-2" />
                  <span className="text-sm text-secondary-600">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-secondary-500">
              Upload up to 4 photos. Clear images with location data help in faster verification.
            </p>
          </div>

          {/* Violation Type */}
          <div>
            <label htmlFor="type" className="block text-lg font-semibold mb-2">
              Type of Violation
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as typeof violationTypes[number])}
              className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {violationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-lg font-semibold mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter location or use current location"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-32"
              placeholder="Provide additional details about the violation..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || images.length === 0}
            className="w-full py-4 bg-primary-500 text-white rounded-lg font-semibold disabled:bg-primary-300 hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// CheckIcon component for success message
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}