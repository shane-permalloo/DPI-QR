import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { QRCodeData } from '../../types';

interface EventFormProps {
  qrData: QRCodeData;
  onDataChange: (newData: Partial<QRCodeData>) => void;
}

const EventForm: React.FC<EventFormProps> = ({ qrData, onDataChange }) => {
  const [eventInfo, setEventInfo] = useState({
    title: qrData.eventInfo?.title || '',
    description: qrData.eventInfo?.description || '',
    location: qrData.eventInfo?.location || '',
    startTime: qrData.eventInfo?.startTime || '',
    endTime: qrData.eventInfo?.endTime || '',
    organizer: qrData.eventInfo?.organizer || '',
    organizerEmail: qrData.eventInfo?.organizerEmail || ''
  });

  useEffect(() => {
    if (qrData.eventInfo) {
      setEventInfo({
        title: qrData.eventInfo.title || '',
        description: qrData.eventInfo.description || '',
        location: qrData.eventInfo.location || '',
        startTime: qrData.eventInfo.startTime || '',
        endTime: qrData.eventInfo.endTime || '',
        organizer: qrData.eventInfo.organizer || '',
        organizerEmail: qrData.eventInfo.organizerEmail || ''
      });
    }
  }, [qrData.eventInfo]);

  const handleChange = (field: keyof typeof eventInfo, value: string) => {
    const newInfo = { ...eventInfo, [field]: value };
    setEventInfo(newInfo);
    onDataChange({ 
      eventInfo: newInfo,
      value: generateICalString(newInfo)
    });
  };

  const generateICalString = (info: typeof eventInfo) => {
    if (!info.title || !info.startTime) return '';
    
    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };

    const startTime = formatDate(info.startTime);
    const endTime = info.endTime ? formatDate(info.endTime) : startTime;

    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${info.title}
DESCRIPTION:${info.description}
LOCATION:${info.location}
DTSTART:${startTime}
DTEND:${endTime}
ORGANIZER;CN=${info.organizer}:mailto:${info.organizerEmail}
END:VEVENT
END:VCALENDAR`;
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
        <Calendar size={20} className="text-blue-600" />
        <h2 className="text-lg font-medium text-gray-800">Event QR Code</h2>
      </div>
      
      <p className="text-sm text-gray-600">
        Generate a QR code that users can scan to add an event to their calendar.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title *
          </label>
          <input
            id="title"
            type="text"
            value={eventInfo.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter event title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={eventInfo.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter event description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={eventInfo.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Enter event location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time *
            </label>
            <input
              id="startTime"
              type="datetime-local"
              value={eventInfo.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              id="endTime"
              type="datetime-local"
              value={eventInfo.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
            Organizer Name
          </label>
          <input
            id="organizer"
            type="text"
            value={eventInfo.organizer}
            onChange={(e) => handleChange('organizer', e.target.value)}
            placeholder="Enter organizer name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-700">
            Organizer Email
          </label>
          <input
            id="organizerEmail"
            type="email"
            value={eventInfo.organizerEmail}
            onChange={(e) => handleChange('organizerEmail', e.target.value)}
            placeholder="Enter organizer email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EventForm; 