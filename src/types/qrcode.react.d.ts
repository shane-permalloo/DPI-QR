declare module 'qrcode.react' {
  import * as React from 'react';

  interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    imageSettings?: {
      src: string;
      width: number;
      height: number;
      excavate?: boolean;
    };
    style?: React.CSSProperties;
  }

  export class QRCodeCanvas extends React.Component<QRCodeProps> {}
} 