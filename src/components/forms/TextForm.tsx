import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { QRCodeData } from '../../types';

interface TextFormProps {
  qrData: QRCodeData;
  onDataChange: (newData: Partial<QRCodeData>) => void;
}

const TextForm: React.FC<TextFormProps> = ({ qrData, onDataChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText size={20} className="text-blue-600" />
        <h2 className="text-lg font-medium text-gray-800">Text QR Code</h2>
      </div>
      
      <p className="text-sm text-gray-600">
        Enter any text to encode in your QR code. This could be a message, note, or any other information.
      </p>
      
      <textarea
        value={qrData.value}
        onChange={(e) => onDataChange({ value: e.target.value })}
        rows={6}
        placeholder="Enter your text here..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <p className="text-xs text-gray-500">
        Character count: {qrData.value?.length || 0} 
        {qrData.value?.length > 500 && (
          <span className="text-amber-600"> (Large amounts of text may reduce readability)</span>
        )}
      </p>
    </motion.div>
  );
};

export default TextForm;