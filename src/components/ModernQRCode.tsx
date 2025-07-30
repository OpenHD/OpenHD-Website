import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import styles from './ModernQRCode.module.css';

interface ModernQRCodeProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
}

export default function ModernQRCode({ 
  value, 
  size = 160,
  title = "Scan to Download",
  subtitle
}: ModernQRCodeProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: value,
      dotsOptions: {
        color: "#1c262f",
        type: "rounded"
      },
      cornersSquareOptions: {
        color: "#00a6f2",
        type: "extra-rounded"
      },
      cornersDotOptions: {
        color: "#0095d9",
        type: "dot"
      },
      backgroundOptions: {
        color: "transparent"
      },
      qrOptions: {
        errorCorrectionLevel: "M"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 8
      }
    });

    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.append(ref.current);
    }
  }, [value, size]);

  return (
    <div className={styles.qrContainer}>
      <div className={styles.qrCodeWrapper}>
        <div ref={ref} className={styles.qrCode} />
      </div>
      
      <div className={styles.qrInfo}>
        <p className={styles.qrTitle}>
          <i className="fas fa-qrcode"></i>
          {title}
        </p>
        {subtitle && (
          <p className={styles.qrSubtitle}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}