import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor() {}

  // Generate QR code as data URL
  async generateQRCodeDataURL(text: string, options?: any): Promise<string> {
    try {
      const defaultOptions = {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M' as const,
        ...options
      };
      
      // Use the qrcode library to generate actual QR code
      const dataURL = await QRCode.toDataURL(text, defaultOptions) as unknown as string;
      return dataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  // Generate QR code as SVG
  async generateQRCodeSVG(text: string, options?: any): Promise<string> {
    try {
      const defaultOptions = {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M' as const,
        ...options
      };
      
      // Use the qrcode library to generate actual QR code SVG
      const svg = (await QRCode.toString(text, { type: 'svg', ...defaultOptions })) as unknown as string;
      return svg;
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw error;
    }
  }

  // Generate QR code for crypto address
  async generateCryptoQRCode(address: string, symbol: string): Promise<string> {
    try {
      const qrText = `${symbol}:${address}`;
      return await this.generateQRCodeDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generating crypto QR code:', error);
      throw error;
    }
  }

  // Generate QR code for payment with amount
  async generatePaymentQRCode(address: string, amount: number, symbol: string): Promise<string> {
    try {
      const qrText = `${symbol}:${address}?amount=${amount}`;
      return await this.generateQRCodeDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generating payment QR code:', error);
      throw error;
    }
  }

  // Validate crypto address format
  isValidCryptoAddress(address: string): boolean {
    if (!address || typeof address !== 'string') {
      return false;
    }
    
    // Basic validation - check if it looks like a crypto address
    // This is a simplified validation, real validation would be more specific per crypto type
    const cryptoAddressPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^[0-9a-fA-F]{40}$|^[A-Za-z0-9]{26,35}$/;
    return cryptoAddressPattern.test(address);
  }
}
