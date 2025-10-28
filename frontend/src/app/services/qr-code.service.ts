import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor() {}

  // Generate QR code as data URL
  async generateQRCodeDataURL(text: string, options?: any): Promise<string> {
    try {
      // For now, return a placeholder data URL
      // In a real implementation, you would use a QR code library like 'qrcode'
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 200;
      
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR Code', 100, 100);
        ctx.fillText(text.substring(0, 20), 100, 120);
      }
      
      return canvas.toDataURL();
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  // Generate QR code as SVG
  async generateQRCodeSVG(text: string, options?: any): Promise<string> {
    try {
      // For now, return a placeholder SVG
      // In a real implementation, you would use a QR code library like 'qrcode'
      return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR Code</text>
        <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="10" fill="black">${text.substring(0, 20)}</text>
      </svg>`;
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
