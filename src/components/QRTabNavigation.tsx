import React from 'react';
import { motion } from 'framer-motion';
import { Link, /*FileText, UserRound, Smartphone, Wifi, Calendar*/ } from 'lucide-react';
import { QRCodeType } from '../types';

interface TabProps {
  activeTab: QRCodeType;
  onTabChange: (tab: QRCodeType) => void;
}

const QRTabNavigation: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'url' as QRCodeType, label: 'URL', icon: Link },
    // { id: 'text' as QRCodeType, label: 'Text', icon: FileText },
    // { id: 'contact' as QRCodeType, label: 'Contact', icon: UserRound },
    // { id: 'app' as QRCodeType, label: 'App', icon: Smartphone },
    // { id: 'wifi' as QRCodeType, label: 'Wi-Fi', icon: Wifi },
    // { id: 'event' as QRCodeType, label: 'Event', icon: Calendar }
  ];

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      <div className="relative flex border-b overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 sm:flex-initial sm:px-8 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-50'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <Icon size={18} />
                <span>{tab.label}</span>
              </div>
              
              {isActive && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"
                  layoutId="tab-indicator"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QRTabNavigation;