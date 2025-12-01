export interface EmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export interface BookingEmailData {
  ownerName: string;
  caregiverName: string;
  petName: string;
  startDate: string;
  endDate: string;
  bookingId: string;
  bookingUrl: string;
}

export interface ReviewEmailData {
  caregiverName: string;
  ownerName: string;
  rating: number;
  comment?: string;
  bookingId: string;
  caregiverProfileUrl: string;
}
