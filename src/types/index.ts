export interface Report {
  id: number;
  type: 'Signal Breaking' | 'Illegal Parking' | 'Rash Driving' | 'Underage Driving' | 'Drunk Driving';
  location: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  reward?: number;
  description: string;
  images: string[];
  geoLocation: {
    latitude: number;
    longitude: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  reportsSubmitted: number;
  totalRewards: number;
  avatar?: string;
}

export interface Reward {
  id: number;
  amount: number;
  date: string;
  reportId: number;
  status: 'pending' | 'paid';
}
