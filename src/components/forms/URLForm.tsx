import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, /*Plus,*/ Trash2, AlertTriangle } from 'lucide-react';
import { QRCodeData } from '../../types';
import { validateUrl } from '../../utils/qrHelpers';

interface URLFormProps {
  qrData: QRCodeData;
  onDataChange: (newData: Partial<QRCodeData>) => void;
  onValidityChange?: (isValid: boolean) => void;
}

const URLForm: React.FC<URLFormProps> = ({ qrData, onDataChange, onValidityChange }) => {
  const [urls, setUrls] = useState<string[]>(qrData.urls || ['']);
  const [errors, setErrors] = useState<string[]>([]);
  const [missingUrlParam, setMissingUrlParam] = useState<boolean>(false);

  useEffect(() => {
    // Get URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlParam = urlParams.get('urlPage');
    
    if (urlParam && urlParam.trim() !== '' && validateUrl(urlParam)) {
      const newUrls = [urlParam];
      setUrls(newUrls);
      setMissingUrlParam(false);
      
      onDataChange({ 
        urls: newUrls,
        value: newUrls.filter(url => url.trim() !== '').join('\n')
      });
      
      // Validate the URL
      if (!validateUrl(urlParam)) {
        setErrors(['Please enter a valid URL (include http:// or https://)']);
        if (onValidityChange) onValidityChange(false);
      } else {
        setErrors(['']);
        if (onValidityChange) onValidityChange(true);
      }
    } else {
      setMissingUrlParam(true);
      if (onValidityChange) onValidityChange(false);
    }
  }, []); // Empty dependency array to run only once on mount

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    
    // Clear error for this index
    const newErrors = [...errors];
    newErrors[index] = '';
    setErrors(newErrors);
    
    onDataChange({ 
      urls: newUrls,
      value: newUrls.filter(url => url.trim() !== '').join('\n')
    });
  };

  // const addUrlField = () => {
  //   setUrls([...urls, '']);
  //   setErrors([...errors, '']);
  // };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      const newErrors = errors.filter((_, i) => i !== index);
      
      setUrls(newUrls);
      setErrors(newErrors);
      
      onDataChange({ 
        urls: newUrls,
        value: newUrls.filter(url => url.trim() !== '').join('\n')
      });
    }
  };

  const validateUrls = () => {
    let isValid = true;
    const newErrors = [...errors];
    
    urls.forEach((url, index) => {
      if (url.trim() === '') {
        newErrors[index] = '';
      } else if (!validateUrl(url)) {
        newErrors[index] = 'Please enter a valid URL (include http:// or https://)';
        isValid = false;
      } else {
        newErrors[index] = '';
      }
    });
    
    setErrors(newErrors);
    return isValid;
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
        <Link size={20} className="text-blue-500" />
        <h2 className="text-2xl text-blue-500">URL QR Code</h2>
      </div>
      
      <p className="text-md text-gray-600">
        The url is prefilled from the DPI Back-office
      </p>
      
      {missingUrlParam && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="text-amber-500 mr-2 flex-shrink-0 mt-2" size={32} />
            <div>
              <p className="text-lg text-amber-800">URL Parameter Missing</p>
              <p className="text-sm text-amber-700">
                Please add the URL parameter to the page address: <code className='text-gray-600 bg-gray-100 px-2 py-2 rounded-md ml-1'>?urlPage=https://example.com</code>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {urls.map((url, index) => (
        <div key={index} className="space-y-1">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              readOnly={true}
              disabled={true}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              onBlur={validateUrls}
              className={`text-md text-gray-600 bg-gray-100 px-3 py-2 rounded-md flex-1 focus:outline-none ${errors[index] ? 'border-red-500' : ''
              }`}
            />
            
            {urls.length > 1 && (
              <button
                onClick={() => removeUrlField(index)}
                className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Remove URL"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          
          {errors[index] && (
            <p className="text-sm text-red-500">{errors[index]}</p>
          )}
        </div>
      ))}
      
    </motion.div>
  );
};

export default URLForm;








