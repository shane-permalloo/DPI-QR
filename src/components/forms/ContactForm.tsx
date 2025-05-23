import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRound } from 'lucide-react';
import { QRCodeData, ContactInfo } from '../../types';
import { validateEmail, validatePhone } from '../../utils/qrHelpers';

interface ContactFormProps {
  qrData: QRCodeData;
  onDataChange: (newData: Partial<QRCodeData>) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ qrData, onDataChange }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});
  
  const contactInfo = qrData.contactInfo || {
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    email: '',
    work: '',
    phone: '',
    address: '',
    country: '',
    website: ''
  };

  const validateField = (field: keyof ContactInfo, value: string) => {
    switch (field) {
      case 'email':
        return value && !validateEmail(value) ? 'Please enter a valid email address' : '';
        case 'work':
        case 'phone':
        return value && !validatePhone(value) ? 'Please enter a valid phone number' : '';
      case 'firstName':
      case 'lastName':
      case 'organization':
      case 'title':
        return !value ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required` : '';
      default:
        return '';
    }
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    const error = validateField(field, value);
    const updatedContact = {
      ...contactInfo,
      [field]: value
    };
    
    setErrors({
      ...errors,
      [field]: error
    });
    
    onDataChange({ 
      contactInfo: updatedContact,
      value: `${updatedContact.firstName} ${updatedContact.lastName}`
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <UserRound size={20} className="text-blue-600" />
        <h2 className="text-lg font-medium text-gray-800">Contact QR Code (vCard)</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Enter contact information to create a vCard QR code that can be scanned to add to contacts.
      </p>
      
      <div className="space-y-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input
              id="firstName"
              type="text"
              value={contactInfo.firstName}
              onChange={(e) => handleContactChange('firstName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input
              id="lastName"
              type="text"
              value={contactInfo.lastName}
              onChange={(e) => handleContactChange('lastName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
              Organization*
            </label>
            <input
              id="organization"
              type="text"
              value={contactInfo.organization}
              onChange={(e) => handleContactChange('organization', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.organization ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.organization && (
              <p className="text-sm text-red-500 mt-1">{errors.organization}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title*
            </label>
            <input
              id="title"
              type="text"
              value={contactInfo.title}
              onChange={(e) => handleContactChange('title', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            id="email"
            type="email"
            value={contactInfo.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="work" className="block text-sm font-medium text-gray-700 mb-1">
              Work Phone
            </label>
            <input
              id="work"
              type="tel"
              value={contactInfo.work}
              onChange={(e) => handleContactChange('work', e.target.value)}
              placeholder="+1234567890"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.work ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.work && (
              <p className="text-sm text-red-500 mt-1">{errors.work}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              placeholder="+1234567890"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
          
          
        </div>
        <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={contactInfo.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              id="country"
              type="text"
              value={contactInfo.country}
              onChange={(e) => handleContactChange('country', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
                  
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            id="website"
            type="url"
            value={contactInfo.website}
            placeholder="https://"
            onChange={(e) => handleContactChange('website', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        * Required fields
      </p>
    </motion.div>
  );
};

export default ContactForm;