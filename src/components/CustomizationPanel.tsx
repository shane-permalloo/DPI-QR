import { useRef, useState, FC, ChangeEvent } from 'react';
import { CirclePicker } from 'react-color';
import { motion } from 'framer-motion';
import { QRCodeStyleOptions } from '../types';
import * as LucideIcons from 'lucide-react';

interface CustomizationPanelProps {
  styleOptions: QRCodeStyleOptions;
  onStyleChange: (newOptions: Partial<QRCodeStyleOptions>) => void;
}

const CustomizationPanel: FC<CustomizationPanelProps> = ({
  styleOptions,
  onStyleChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    styleOptions.logoImage
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setUploadError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setUploadError('Failed to process image');
          return;
        }

        // Calculate dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxSize = 96;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const optimizedDataUrl = canvas.toDataURL('image/png');
          setLogoPreview(optimizedDataUrl);
          onStyleChange({
            logoImage: optimizedDataUrl,
            logoWidth: width,
            logoHeight: height
          });
        } catch (error) {
          setUploadError('Failed to process image');
        }
      };
      img.onerror = () => {
        setUploadError('Failed to load image');
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      setUploadError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    onStyleChange({ logoImage: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const qrColors = [
    '#000000', // Black on white
    '#3B82F6', // Blue
    '#8B5CF6', // Deep Purple
    '#EC4899', // Pink
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Green
    '#14B8A6', // Teal
    '#6366F1', // Indigo
    '#4B5563', // Gray
    '#1E40AF', // Navy
    '#7C3AED', // Violet
    '#BE185D', // Rose
    '#991B1B', // Dark Red
    '#92400E', // Dark Orange
    '#065F46', // Dark Green
    '#155E75', // Deep Teal
    '#1E3A8A', // Deep Indigo
    '#D32F2F', // Material Red 700
    '#1976D2', // Material Blue 700
    '#388E3C', // Material Green 700
    '#F57C00', // Material Orange 700
    '#7B1FA2', // Material Purple 700
    '#00838F'  // Material Cyan 700
  ];

  const backgroundColors = [
    '#FFFFFF', // White for contrast
    '#EFF6FF', // Light Blue
    '#F5F3FF', // Lavender
    '#FCE7F3', // Light Pink
    '#ffebee', // Light Red
    '#FEF3C7', // Light Amber
    '#ECFDF5', // Light Green
    '#CFFAFE', // Pale Teal
    '#E0E7FF', // Indigo tint
    '#F3F4F6', // Light Gray
    '#DBEAFE', // Light Navy
    '#EDE9FE', // Pale Violet
    '#FFE4E6', // Rose Pink
    '#FEE2E2', // Light Red again
    '#FFF7ED', // Light Amber
    '#D1FAE5', // Mint green
    '#E0F2FE', // Sky blue
    '#EEF2FF', // Very pale Indigo
    '#FFEBEE', // Material Red 50
    '#E3F2FD', // Material Blue 50
    '#E8F5E9', // Material Green 50
    '#FFF3E0', // Material Orange 50
    '#F3E5F5', // Material Purple 50
    '#E0F7FA'  // Material Cyan 50
  ];

  const errorCorrectionLevels = [
    { value: 'L' as const, label: 'Low (7%)' },
    { value: 'M' as const, label: 'Medium (15%)' },
    { value: 'Q' as const, label: 'Quartile (25%)' },
    { value: 'H' as const, label: 'High (30%)' }
  ];

  return (
    <motion.div
      className="bg-white p-6 rounded-md shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <LucideIcons.Sliders size={20} />
        Customization
      </h2>

      <div className="space-y-6">

        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-800">QR Code Color</h3>
          <CirclePicker
            color={styleOptions.fgColor}
            colors={qrColors}
            onChange={(color) => onStyleChange({ fgColor: color.hex })}
            circleSize={30}
            circleSpacing={10}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-800">Background Color</h3>
          <CirclePicker
            color={styleOptions.bgColor}
            colors={backgroundColors}
            onChange={(color) => onStyleChange({ bgColor: color.hex })}
            circleSize={30}
            circleSpacing={10}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-800">Error Correction</h3>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={styleOptions.level}
            onChange={(e) => onStyleChange({ level: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
          >
            {errorCorrectionLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Higher correction allows for more damage to the QR code while remaining scannable.
            Choose "High" if adding a logo.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-800">Size</h3>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="125"
              max="400"
              step="5"
              value={styleOptions.size}
              onChange={(e) => onStyleChange({ size: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
            <span className="text-gray-700 w-12 text-right">{styleOptions.size}px</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-800 flex items-center gap-2">
            Logo/Icon
          </h3>

          <div className="space-y-3">
            {logoPreview ? (
              <div className="relative inline-block">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 w-16 object-contain border border-gray-200 rounded-lg"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <LucideIcons.X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <LucideIcons.Image size={18} />
                Upload Logo
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {uploadError && (
              <p className="text-sm text-red-500">{uploadError}</p>
            )}

            {logoPreview && (
              <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 block mb-1 text-nowrap">Logo Size</label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="2"
                    value={styleOptions.logoWidth || 90}
                    onChange={(e) => {
                      const size = parseInt(e.target.value);
                      onStyleChange({
                        logoWidth: size,
                        logoHeight: size
                      });
                    }}
                    className="w-full accent-blue-500"
                  />
                <span className="text-gray-700 w-12 text-right">
                  {styleOptions.logoWidth || 90}px
                </span>
              </div>
            )}

            <p className="text-xs text-gray-500">
              For best results, use a square logo with transparent background.
              Non-square logos will be resized maintaining aspect ratio.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="include-margin" className="text-gray-700">
            Include Margin around the QR code
          </label>
          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
            <input
              type="checkbox"
              id="include-margin"
              checked={styleOptions.includeMargin}
              onChange={(e) => onStyleChange({ includeMargin: e.target.checked })}
              className="absolute w-0 h-0 opacity-0"
            />
            <label
              htmlFor="include-margin"
              className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                styleOptions.includeMargin ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span 
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                  styleOptions.includeMargin ? 'transform translate-x-6' : ''
                }`}
              />
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomizationPanel;
