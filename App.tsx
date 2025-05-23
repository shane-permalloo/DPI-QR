import { useState, useEffect } from 'react';
import { QRCodeData, QRCodeStyleOptions, QRCodeType, HistoryItem } from './types';
import QRTabNavigation from './components/QRTabNavigation';
import QRPreview from './components/QRPreview';
import CustomizationPanel from './components/CustomizationPanel';
import URLForm from './components/forms/URLForm';
// import TextForm from './components/forms/TextForm';
// import ContactForm from './components/forms/ContactForm';
// import AppForm from './components/forms/AppForm';
// import WifiForm from './components/forms/WifiForm';
// import EventForm from './components/forms/EventForm';
import HistoryList from './components/HistoryList';
import { motion } from 'framer-motion';
import { QrCode, History } from 'lucide-react';
import logoImage from './assets/logo.png';
import { getHistory, saveToHistory, removeFromHistory, clearHistory } from './utils/db';

function App() {
  const [activeTab, setActiveTab] = useState<QRCodeType>('url');
  const [qrData, setQrData] = useState<QRCodeData>({
    type: 'url',
    value: 'https://',
    urls: ['https://']
  });
  
  const [styleOptions, setStyleOptions] = useState<QRCodeStyleOptions>({
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    size: 256,
    level: 'H',
    includeMargin: false,
    logoImage: logoImage,
    logoHeight: 30,
    logoWidth: 90
  });
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isValidPreview, setIsValidPreview] = useState<boolean>(false);

  // Load history from IndexedDB
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await getHistory();
        setHistory(savedHistory);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };
    loadHistory();
  }, []);

  const handleTabChange = (tab: QRCodeType) => {
    setActiveTab(tab);
    
    // Reset the form data based on the selected tab
    switch (tab) {
      case 'url':
        setQrData({
          type: 'url',
          value: 'https://',
          urls: ['']
        });
        break;
      case 'text':
        setQrData({
          type: 'text',
          value: ''
        });
        break;
      case 'contact':
        setQrData({
          type: 'contact',
          value: '',
          contactInfo: {
            firstName: '',
            lastName: '',
            organization: 'Mauritius Network Services Ltd.',
            title: '',
            email: '',
            phone: '',
            address: 'Silicon Avenue, Cybercity, Ebene',
            country: 'Mauritius',
            website: 'https://www.mns.mu/'
          }
        });
        break;
      case 'app':
        setQrData({
          type: 'app',
          value: '',
          appLinks: {
            googlePlay: '',
            appStore: '',
            huaweiAppGallery: ''
          }
        });
        break;
      case 'wifi':
        setQrData({
          type: 'wifi',
          value: '',
          wifiConfig: {
            ssid: '',
            password: '',
            encryption: 'WPA',
            hidden: false
          }
        });
        break;
      case 'event':
        setQrData({
          type: 'event',
          value: '',
          eventInfo: {
            title: '',
            description: '',
            location: '',
            startTime: '',
            endTime: '',
            organizer: '',
            organizerEmail: ''
          }
        });
        break;
    }
  };

  const handleDataChange = (newData: Partial<QRCodeData>) => {
    const updatedData = { ...qrData, ...newData };
    setQrData(updatedData);
  };

  const handleStyleChange = (newOptions: Partial<QRCodeStyleOptions>) => {
    setStyleOptions({ ...styleOptions, ...newOptions });
  };

  const handleValidityChange = (isValid: boolean) => {
    setIsValidPreview(isValid);
  };

  const saveToHistoryDB = async (data: QRCodeData) => {
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      data: { ...data },
      style: { ...styleOptions },
      createdAt: new Date()
    };
    
    try {
      await saveToHistory(newHistoryItem);
      setHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 10));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setQrData(item.data);
    setStyleOptions(item.style);
    setActiveTab(item.data.type);
    setShowHistory(false);
  };

  const removeHistoryItem = async (id: string) => {
    try {
      await removeFromHistory(id);
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing history item:', error);
    }
  };

  const clearHistoryDB = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'url':
        return <URLForm 
          qrData={qrData} 
          onDataChange={handleDataChange} 
          onValidityChange={handleValidityChange}
        />;
      // case 'text':
      //   return <TextForm qrData={qrData} onDataChange={handleDataChange} />;
      // case 'contact':
      //   return <ContactForm qrData={qrData} onDataChange={handleDataChange} />;
      // case 'app':
      //   return <AppForm qrData={qrData} onDataChange={handleDataChange} />;
      // case 'wifi':
      //   return <WifiForm qrData={qrData} onDataChange={handleDataChange} />;
      // case 'event':
      //   return <EventForm qrData={qrData} onDataChange={handleDataChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <QrCode size={28} className="text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">DPI QR Code Generator</h1>
            </div>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
            >
              <History size={18} />
              <span className="text-sm font-medium hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-6 gap-6">
          {/* Left Column - Form */}
          <div className="md:col-span-4 space-y-6">
            <QRTabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            
            <div className="bg-white p-8 rounded-md shadow-lg">
              {renderActiveForm()}
            </div>
            
            {/* Mobile Preview */}
            <div className="md:hidden">
              <QRPreview 
                qrData={qrData} 
                styleOptions={styleOptions} 
                onDownload={() => saveToHistoryDB(qrData)}
                isValidPreview={isValidPreview}
              />
            </div>
          </div>
          
          {/* Right Column - Preview & Customization */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              animate={{ x: showHistory ? -400 : 0, opacity: showHistory ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className={`space-y-6 ${showHistory ? 'hidden md:block' : ''}`}
            >
              {/* Desktop Preview */}
              <div className="hidden md:block">
                <QRPreview 
                  qrData={qrData} 
                  styleOptions={styleOptions} 
                  onDownload={() => saveToHistoryDB(qrData)}
                  isValidPreview={isValidPreview}
                />
              </div>
              
              <CustomizationPanel 
                styleOptions={styleOptions} 
                onStyleChange={handleStyleChange} 
              />
            </motion.div>
            
            {/* History Sidebar */}
            <motion.div
              animate={{ x: showHistory ? 0 : 400, opacity: showHistory ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className={`absolute top-10 bg-white right-0 border-b border-l border-r border-gray-200 shadow-sm shadow-gray-200 rounded-bl-md rounded-br-md w-full md:w-96 ${showHistory ? 'block' : 'hidden'}`}
            >
              <HistoryList 
                history={history}
                onSelectItem={loadFromHistory}
                onRemoveItem={removeHistoryItem}
                onClearHistory={clearHistoryDB}
              />
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Mauritius Network Services Ltd. All rights reserved. | <a href="https://www.mns.mu/wp-content/uploads/2024/07/DC0-MNS_Privacy-Notice.pdf" target="_blank">Privacy Notice</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;



