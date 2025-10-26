import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  
  /**
   * Generate QR code as data URL (base64 image)
   * @param text - The text/address to encode
   * @param options - QR code generation options
   * @returns Promise<string> - Data URL of the QR code image
   */
  async generateQRCodeDataURL(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
    const defaultOptions: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256,
      ...options
    };

    try {
      return await QRCode.toDataURL(text, defaultOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as SVG string
   * @param text - The text/address to encode
   * @param options - QR code generation options
   * @returns Promise<string> - SVG string of the QR code
   */
  async generateQRCodeSVG(text: string, options?: QRCode.QRCodeToStringOptions): Promise<string> {
    const defaultOptions: QRCode.QRCodeToStringOptions = {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256,
      type: 'svg',
      ...options
    };

    try {
      return await QRCode.toString(text, defaultOptions);
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Failed to generate QR code SVG');
    }
  }

  /**
   * Generate QR code for crypto wallet address with custom styling
   * @param address - The crypto wallet address
   * @param symbol - The crypto symbol (BTC, ETH, etc.)
   * @returns Promise<string> - Data URL of the QR code image
   */
  async generateCryptoQRCode(address: string, symbol: string): Promise<string> {
    const options: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 2,
      color: {
        dark: '#1f2937', // Dark gray
        light: '#ffffff'
      },
      width: 300
    };

    // Add crypto symbol as a label in the QR code
    const qrText = `${symbol}:${address}`;
    
    try {
      return await QRCode.toDataURL(qrText, options);
    } catch (error) {
      console.error('Error generating crypto QR code:', error);
      throw new Error('Failed to generate crypto QR code');
    }
  }

  /**
   * Generate QR code for payment with amount
   * @param address - The crypto wallet address
   * @param amount - The amount to send
   * @param symbol - The crypto symbol
   * @returns Promise<string> - Data URL of the QR code image
   */
  async generatePaymentQRCode(address: string, amount: number, symbol: string): Promise<string> {
    const options: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 2,
      color: {
        dark: '#059669', // Green for payment
        light: '#ffffff'
      },
      width: 300
    };

    // Create payment URI (some wallets support this format)
    const paymentURI = `${symbol.toLowerCase()}:${address}?amount=${amount}`;
    
    try {
      return await QRCode.toDataURL(paymentURI, options);
    } catch (error) {
      console.error('Error generating payment QR code:', error);
      // Fallback to simple address QR code
      return this.generateCryptoQRCode(address, symbol);
    }
  }

  /**
   * Validate if a string looks like a crypto address
   * @param address - The address to validate
   * @returns boolean - True if it looks like a valid crypto address
   */
  isValidCryptoAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    
    // Basic validation patterns for common crypto addresses
    const patterns = {
      bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
      ethereum: /^0x[a-fA-F0-9]{40}$/,
      litecoin: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
      tron: /^T[A-Za-z1-9]{33}$/,
      generic: /^[a-zA-Z0-9]{20,}$/
    };

    return Object.values(patterns).some(pattern => pattern.test(address));
  }
}
