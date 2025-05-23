export type QRCodeType = 'url' | 'text' | 'contact' | 'app' | 'wifi' | 'event';

export interface QRCodeData {
  type: QRCodeType;
  value: string;
  urls?: string[];
  contactInfo?: {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    website: string;
  };
  appLinks?: {
    googlePlay: string;
    appStore: string;
    huaweiAppGallery: string;
  };
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

export interface QRCodeStyleOptions {
  logoHeight: number;
  logoWidth: number;
  fgColor: string;
  bgColor: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  logoImage: string;
}

export interface HistoryItem {
  id: string;
  data: QRCodeData;
  style: QRCodeStyleOptions;
  createdAt: Date;
} 