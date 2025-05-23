import { ContactInfo, AppLinks } from '../types';

export const generateVCard = (contact: ContactInfo): string => {
  let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
  
  if (contact.firstName || contact.lastName) {
    vcard += `N:${contact.lastName || ''};${contact.firstName || ''}\n`;
  }
  
  if (contact.organization) {
    vcard += `ORG:${contact.organization}\n`;
  }
  
  if (contact.title) {
    vcard += `TITLE:${contact.title}\n`;
  }
  
  if (contact.email) {
    vcard += `EMAIL;TYPE=INTERNET:${contact.email}\n`;
  }
  
  if (contact.phone) {
    vcard += `TEL;TYPE=CELL:${contact.phone}\n`;
  }
  
  if (contact.work) {
    vcard += `TEL;TYPE=WORK,VOICE:${contact.work}\n`;
  }
  
  if (contact.address) {
    vcard += `ADR;TYPE=WORK:;;${contact.address};;;${contact.country || ''};\n`;
  }
  
  if (contact.website) {
    vcard += `URL;TYPE=WORK:${contact.website}\n`;
  }
  
  vcard += 'END:VCARD';
  return vcard;
};

export const generateAppLinks = (appLinks: AppLinks): string => {
  let links = '';
  
  if (appLinks.googlePlay) {
    links += `Google Play: ${appLinks.googlePlay}\n`;
  }
  
  if (appLinks.appStore) {
    links += `App Store: ${appLinks.appStore}\n`;
  }
  
  if (appLinks.huaweiAppGallery) {
    links += `Huawei AppGallery: ${appLinks.huaweiAppGallery}\n`;
  }
  
  return links.trim();
};

export const generateMultipleUrls = (urls: string[]): string => {
  return urls.filter(url => url.trim() !== '').join('\n');
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phone === '' || phoneRegex.test(phone);
};
