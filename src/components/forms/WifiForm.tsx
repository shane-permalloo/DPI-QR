import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';
import { QRCodeData } from '../../types';

interface WifiFormProps {
  qrData: QRCodeData;
  onDataChange: (newData: Partial<QRCodeData>) => void;
}

const WifiForm: React.FC<WifiFormProps> = ({ qrData, onDataChange }) => {
  const [wifiConfig, setWifiConfig] = useState({
    ssid: qrData.wifiConfig?.ssid || '',
    password: qrData.wifiConfig?.password || '',
    encryption: qrData.wifiConfig?.encryption || 'WPA',
    hidden: qrData.wifiConfig?.hidden || false
  });

  const [errors, setErrors] = useState({
    ssid: '',
    password: ''
  });

  useEffect(() => {
    if (qrData.wifiConfig) {
      setWifiConfig({
        ssid: qrData.wifiConfig.ssid || '',
        password: qrData.wifiConfig.password || '',
        encryption: qrData.wifiConfig.encryption || 'WPA',
        hidden: qrData.wifiConfig.hidden || false
      });
    }
  }, [qrData.wifiConfig]);

  const validateField = (field: keyof typeof wifiConfig, value: string) => {
    switch (field) {
      case 'ssid':
        return !value ? 'Network name is required' : '';
      case 'password':
        return wifiConfig.encryption !== 'nopass' && !value ? 'Password is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (field: keyof typeof wifiConfig, value: string | boolean) => {
    const newConfig = { ...wifiConfig, [field]: value };
    setWifiConfig(newConfig);
    
    // Validate the field
    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors({
        ...errors,
        [field]: error
      });
    }
    
    onDataChange({ 
      wifiConfig: newConfig,
      value: generateWifiString(newConfig)
    });
  };

  const generateWifiString = (config: typeof wifiConfig) => {
    const { ssid, password, encryption, hidden } = config;
    if (!ssid) return '';
    
    const hiddenStr = hidden ? 'H:true;' : '';
    const passwordStr = password ? `P:${password};` : '';
    const encryptionStr = encryption !== 'nopass' ? `T:${encryption};` : 'T:nopass;';
    
    return `WIFI:S:${ssid};${encryptionStr}${passwordStr}${hiddenStr};`;
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
        <Wifi size={20} className="text-blue-600" />
        <h2 className="text-lg font-medium text-gray-800">Wi-Fi QR Code</h2>
      </div>
      
      <p className="text-sm text-gray-600">
        Generate a QR code that users can scan to connect to your Wi-Fi network.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="ssid" className="block text-sm font-medium text-gray-700">
            Network Name (SSID) *
          </label>
          <input
            id="ssid"
            type="text"
            value={wifiConfig.ssid}
            onChange={(e) => handleChange('ssid', e.target.value)}
            placeholder="Enter your Wi-Fi network name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.ssid ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.ssid && (
            <p className="text-sm text-red-500">{errors.ssid}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="encryption" className="block text-sm font-medium text-gray-700">
            Security Type
          </label>
          <select
            id="encryption"
            value={wifiConfig.encryption}
            onChange={(e) => handleChange('encryption', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">No Password</option>
          </select>
        </div>
        
        {wifiConfig.encryption !== 'nopass' && (
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={wifiConfig.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Enter your Wi-Fi password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <input
            id="hidden"
            type="checkbox"
            checked={wifiConfig.hidden}
            onChange={(e) => handleChange('hidden', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hidden" className="text-sm text-gray-700">
            Hidden Network
          </label>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        * Required fields
      </p>
    </motion.div>
  );
};

export default WifiForm; 