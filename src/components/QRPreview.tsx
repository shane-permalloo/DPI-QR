import { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { QRCodeData, QRCodeStyleOptions } from '../types';
import { generateVCard, generateAppLinks, generateMultipleUrls } from '../utils/qrHelpers';

interface QRPreviewProps {
  qrData: QRCodeData;
  styleOptions: QRCodeStyleOptions;
  onDownload?: () => void;
  isValidPreview?: boolean;
  onValidityChange?: (isValid: boolean) => void;
}

const QRPreview: React.FC<QRPreviewProps> = ({ 
  qrData, 
  styleOptions, 
  onDownload,
  isValidPreview = true,
  onValidityChange
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrValue, setQrValue] = useState<string>('');
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg' | 'svg'>('png');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    let valueToEncode = '';
    let isValid = false;

    switch (qrData.type) {
      case 'url':
        valueToEncode = qrData.urls && qrData.urls.length > 0
          ? generateMultipleUrls(qrData.urls)
          : qrData.value;
        isValid = valueToEncode.trim() !== '';
        break;
      case 'text':
        valueToEncode = qrData.value;
        isValid = valueToEncode.trim() !== '';
        break;
      case 'contact':
        valueToEncode = qrData.contactInfo
          ? generateVCard(qrData.contactInfo)
          : '';
        isValid = qrData.contactInfo?.firstName?.trim() !== '' || 
                 qrData.contactInfo?.lastName?.trim() !== '' || 
                 qrData.contactInfo?.email?.trim() !== '' || 
                 qrData.contactInfo?.phone?.trim() !== '';
        break;
      case 'app':
        valueToEncode = qrData.appLinks
          ? generateAppLinks(qrData.appLinks)
          : '';
        isValid = qrData.appLinks?.googlePlay?.trim() !== '' || 
                 qrData.appLinks?.appStore?.trim() !== '' || 
                 qrData.appLinks?.huaweiAppGallery?.trim() !== '';
        break;
      case 'wifi':
        valueToEncode = qrData.wifiConfig
          ? `WIFI:T:${qrData.wifiConfig.encryption};S:${qrData.wifiConfig.ssid};P:${qrData.wifiConfig.password};H:${qrData.wifiConfig.hidden};`
          : '';
        isValid = qrData.wifiConfig?.ssid?.trim() !== '';
        break;
      case 'event':
        if (qrData.eventInfo) {
          const formatDate = (dateStr: string) => {
            if (!dateStr || dateStr.trim() === '') {
              return '';
            }
            
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
              return '';
            }
            
            try {
              return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            } catch (error) {
              console.error('Error formatting date:', error);
              return '';
            }
          };

          const startTime = formatDate(qrData.eventInfo.startTime);
          const endTime = qrData.eventInfo.endTime ? formatDate(qrData.eventInfo.endTime) : startTime;

          valueToEncode = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${qrData.eventInfo.title}
DESCRIPTION:${qrData.eventInfo.description}
LOCATION:${qrData.eventInfo.location}
DTSTART:${startTime}
DTEND:${endTime}
ORGANIZER;CN=${qrData.eventInfo.organizer}:mailto:${qrData.eventInfo.organizerEmail}
END:VEVENT
END:VCALENDAR`;
          
          isValid = qrData.eventInfo.title?.trim() !== '' && 
                   qrData.eventInfo.startTime?.trim() !== '' &&
                   startTime !== '';
        }
        break;
      default:
        valueToEncode = qrData.value;
        isValid = valueToEncode.trim() !== '';
    }

    setQrValue(valueToEncode);
    if (onValidityChange) onValidityChange(isValid);
  }, [qrData]);

  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      let dataUrl: string;
      const filename = `qrcode-${Date.now()}`;

      switch (downloadFormat) {
        case 'png':
          dataUrl = await toPng(qrRef.current);
          saveAs(dataUrl, `${filename}.png`);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(qrRef.current);
          saveAs(dataUrl, `${filename}.jpeg`);
          break;
        case 'svg':
          dataUrl = await toSvg(qrRef.current);
          saveAs(dataUrl, `${filename}.svg`);
          break;
        default:
          dataUrl = await toPng(qrRef.current);
          saveAs(dataUrl, `${filename}.png`);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const renderQRCodeWithLogo = () => {
    if (!qrValue) return null;

    return (
      <div
        className="relative bg-white"
        style={{ backgroundColor: styleOptions.bgColor }}
      >
        <QRCodeCanvas
          value={qrValue}
          size={styleOptions.size}
          bgColor={styleOptions.bgColor}
          fgColor={styleOptions.fgColor}
          level={styleOptions.level}
          includeMargin={styleOptions.includeMargin}
          imageSettings={
            styleOptions.logoImage
              ? {
                src: styleOptions.logoImage,
                width: styleOptions.logoWidth || 90,
                height: styleOptions.logoHeight || 30,
                excavate: true,
              }
              : undefined
          }
        />
      </div>
    );
  };

  return (
    <motion.div
      className="flex flex-col items-center p-6 bg-white rounded-md shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Preview</h2>

      <div
        ref={qrRef}
        className="mb-8 p-4 bg-white rounded-lg flex items-center justify-center relative"
      >
        {renderQRCodeWithLogo()}
        
        {!isValidPreview && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center rounded-lg">
            <div className="text-center p-4">
              <AlertTriangle size={48} className="mx-auto mb-2 text-amber-500" />
              <p className="text-gray-700 text-sm font-medium bg-gray-100 bg-opacity-90 rounded-md p-2">URL parameter missing<br />Add a valid URL to generate QR code</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full space-y-4">
        <div className="flex gap-2">
          <select
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value as never)}
            disabled={!isValidPreview}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="svg">SVG</option>
          </select>

          <motion.button
            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              isValidPreview
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileTap={{ scale: isValidPreview ? 0.95 : 1 }}
            onClick={handleDownload}
            disabled={!isValidPreview}
          >
            {downloadSuccess ? <CheckCircle size={18} /> : <Download size={18} />}
            {downloadSuccess ? 'Downloaded!' : 'Download'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default QRPreview;




