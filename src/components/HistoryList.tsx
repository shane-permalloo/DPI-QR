import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowUpRight, Trash2 } from 'lucide-react';
import { HistoryItem, QRCodeData } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectItem,
  onClearHistory,
  onRemoveItem
}) => {
  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Clock size={24} className="mx-auto mb-2 opacity-40" />
        <p>There no QR code yet.<br />
        Your QR code history will be populated here each time you download a QR code.</p>
      </div>
    );
  }

  const getQRTypeLabel = (type: QRCodeData['type']) => {
    switch (type) {
      case 'url': return 'URL';
      case 'text': return 'Text';
      case 'contact': return 'Contact';
      case 'app': return 'App';
      case 'wifi': return 'Wi-Fi';
      case 'event': return 'Event';
      default: return 'QR Code';
    }
  };

  const getQRDescription = (data: QRCodeData) => {
    switch (data.type) {
      case 'url':
        return data.urls && data.urls[0] 
          ? (data.urls[0].length > 30 ? data.urls[0].substring(0, 30) + '...' : data.urls[0])
          : 'URL QR Code';
      case 'text':
        return data.value 
          ? (data.value.length > 30 ? data.value.substring(0, 30) + '...' : data.value)
          : 'Text QR Code';
      case 'contact':
        return data.contactInfo 
          ? `${data.contactInfo.firstName} ${data.contactInfo.lastName}` 
          : 'Contact QR Code';
      case 'app':
        return 'App Store Links';
      case 'wifi':
        return data.wifiConfig 
          ? `Wi-Fi: ${data.wifiConfig.ssid}`
          : 'Wi-Fi QR Code';
      case 'event':
        return data.eventInfo 
          ? `Event: ${data.eventInfo.title}`
          : 'Event QR Code';
      default:
        return 'QR Code';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-md shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          <Clock size={18} /> Recent QR Codes
        </h3>
        
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear All
          </button>
        )}
      </div>
      
      <AnimatePresence initial={false}>
        <motion.ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="flex items-center p-3 hover:bg-gray-50 transition-colors">
                <div 
                  className="w-10 h-10 flex items-center justify-center rounded-md mr-3"
                  style={{ backgroundColor: item.style.bgColor }}
                >
                  <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: item.style.fgColor }}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getQRTypeLabel(item.data.type)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {getQRDescription(item.data)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectItem(item)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Load QR code"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                  
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove from history"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
};

export default HistoryList;