import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { QRCodeData, AppLinks } from '../../types';
import { validateUrl } from '../../utils/qrHelpers';

interface AppFormProps {
  qrData: QRCodeData;
  onDataChange: (newData: Partial<QRCodeData>) => void;
}

const AppForm: React.FC<AppFormProps> = ({ qrData, onDataChange }) => {
  const appLinks = qrData.appLinks || {
    googlePlay: '',
    appStore: '',
    huaweiAppGallery: ''
  };

  const [errors, setErrors] = React.useState<Record<string, string>>({
    googlePlay: '',
    appStore: '',
    huaweiAppGallery: ''
  });

  const handleAppLinkChange = (platform: keyof AppLinks, value: string) => {
    const updatedLinks = {
      ...appLinks,
      [platform]: value
    };
    
    // Clear error for this field
    setErrors({
      ...errors,
      [platform]: ''
    });
    
    onDataChange({ 
      appLinks: updatedLinks,
      value: `App Links:\n${value ? `${platform}: ${value}\n` : ''}${
        Object.entries(updatedLinks)
          .filter(([key, val]) => key !== platform && val)
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n')
      }`
    });
  };

  const validateLinks = (platform: keyof AppLinks, value: string) => {
    if (!value) {
      return setErrors({
        ...errors,
        [platform]: ''
      });
    }
    
    if (!validateUrl(value)) {
      setErrors({
        ...errors,
        [platform]: 'Please enter a valid URL (include http:// or https://)'
      });
    }
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
        <Smartphone size={20} className="text-blue-600" />
        <h2 className="text-lg font-medium text-gray-800">App Store Links</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Add links to your app on different app stores. Enter at least one app store link.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="googlePlay" className="block text-sm font-medium text-gray-700">
            Google Play Store
          </label>
          <input
            id="googlePlay"
            type="url"
            value={appLinks.googlePlay}
            onChange={(e) => handleAppLinkChange('googlePlay', e.target.value)}
            onBlur={(e) => validateLinks('googlePlay', e.target.value)}
            placeholder="https://play.google.com/store/apps/details?id=..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.googlePlay ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.googlePlay && (
            <p className="text-sm text-red-500">{errors.googlePlay}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="appStore" className="block text-sm font-medium text-gray-700">
            Apple App Store
          </label>
          <input
            id="appStore"
            type="url"
            value={appLinks.appStore}
            onChange={(e) => handleAppLinkChange('appStore', e.target.value)}
            onBlur={(e) => validateLinks('appStore', e.target.value)}
            placeholder="https://apps.apple.com/app/id..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.appStore ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.appStore && (
            <p className="text-sm text-red-500">{errors.appStore}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="huaweiAppGallery" className="block text-sm font-medium text-gray-700">
            Huawei App Gallery
          </label>
          <input
            id="huaweiAppGallery"
            type="url"
            value={appLinks.huaweiAppGallery}
            onChange={(e) => handleAppLinkChange('huaweiAppGallery', e.target.value)}
            onBlur={(e) => validateLinks('huaweiAppGallery', e.target.value)}
            placeholder="https://appgallery.huawei.com/app/..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.huaweiAppGallery ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.huaweiAppGallery && (
            <p className="text-sm text-red-500">{errors.huaweiAppGallery}</p>
          )}
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        Enter at least one app store link. Links will be displayed in text format when the QR code is scanned.
      </p>
    </motion.div>
  );
};

export default AppForm;