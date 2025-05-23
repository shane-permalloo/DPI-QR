export type QRCodeType = 'url' | 'text' | 'contact' | 'app' | 'wifi' | 'event';

export interface QRCodeData {
  type: QRCodeType;
  value: string;
  urls?: string[];
  contactInfo?: ContactInfo;
  appLinks?: AppLinks;
  wifiConfig?: {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden: boolean;
  };
  eventInfo?: {
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    organizer: string;
    organizerEmail: string;
  };
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  website: string;
}

export interface AppLinks {
  googlePlay: string;
  appStore: string;
  huaweiAppGallery: string;
}

export interface QRCodeStyleOptions {
  fgColor: string;
  bgColor: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  logoImage?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export interface HistoryItem {
  id: string;
  data: QRCodeData;
  style: QRCodeStyleOptions;
  createdAt: Date;
}