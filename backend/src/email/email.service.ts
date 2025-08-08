import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to 360-Web</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
          
          body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #4a4a4a;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          .email-header {
            background: linear-gradient(135deg, #4361ee, #3a0ca3);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 4px solid #3a0ca3;
          }
          
          .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          
          .email-body {
            padding: 30px;
          }
          
          .email-content {
            margin-bottom: 25px;
          }
          
          .email-content h2 {
            color: #2b2d42;
            font-size: 22px;
            margin-top: 0;
          }
          
          .email-content p {
            font-size: 15px;
            margin-bottom: 15px;
          }
          
          .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #4361ee, #3a0ca3);
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 500;
            margin: 20px 0;
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            background: linear-gradient(135deg, #3a0ca3, #4361ee);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(58, 12, 163, 0.2);
          }
          
          .email-footer {
            text-align: center;
            padding: 20px;
            background: #f1f5fe;
            color: #64748b;
            font-size: 13px;
            border-top: 1px solid #e2e8f0;
          }
          
          .email-footer p {
            margin: 5px 0;
          }
          
          .text-center {
            text-align: center;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              border-radius: 0;
            }
            
            .email-header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Welcome to 360-Web! 🎉</h1>
          </div>
          
          <div class="email-body">
            <div class="email-content">
              <h2>Hello ${username}!</h2>
              <p>We're thrilled to welcome you to 360-Web! Your account has been successfully created and you're now part of our community.</p>
              <p>With your new account, you can:</p>
              <ul>
                <li>Browse our extensive product catalog</li>
                <li>Save items to your wishlist</li>
                <li>Enjoy fast and secure checkout</li>
                <li>Track your orders in real-time</li>
              </ul>
            </div>
            
            <div class="text-center">
              <a href="http://localhost:4200" class="cta-button">Start Shopping Now</a>
            </div>
            
            <div class="email-content">
              <p>If you have any questions, feel free to reply to this email. Our team is always happy to help!</p>
            </div>
          </div>
          
          <div class="email-footer">
            <p>© ${new Date().getFullYear()} 360-Web. All rights reserved.</p>
            <p>123 Web Street, Digital City, 10001</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to,
      subject: 'Welcome to 360-Web! 🎉',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `http://localhost:4200/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - 360-Web</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
          
          body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #4a4a4a;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          .email-header {
            background: linear-gradient(135deg, #ef233c, #d90429);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 4px solid #d90429;
          }
          
          .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          
          .email-body {
            padding: 30px;
          }
          
          .email-content {
            margin-bottom: 25px;
          }
          
          .email-content h2 {
            color: #2b2d42;
            font-size: 22px;
            margin-top: 0;
          }
          
          .email-content p {
            font-size: 15px;
            margin-bottom: 15px;
          }
          
          .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #ef233c, #d90429);
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 500;
            margin: 20px 0;
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            background: linear-gradient(135deg, #d90429, #ef233c);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(217, 4, 41, 0.2);
          }
          
          .token-box {
            word-break: break-all;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ef233c;
            font-family: monospace;
            font-size: 14px;
            margin: 20px 0;
          }
          
          .email-footer {
            text-align: center;
            padding: 20px;
            background: #fef2f2;
            color: #64748b;
            font-size: 13px;
            border-top: 1px solid #fee2e2;
          }
          
          .email-footer p {
            margin: 5px 0;
          }
          
          .text-center {
            text-align: center;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              border-radius: 0;
            }
            
            .email-header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Password Reset Request 🔐</h1>
          </div>
          
          <div class="email-body">
            <div class="email-content">
              <h2>Hello!</h2>
              <p>We received a request to reset your password for your 360-Web account.</p>
              <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            </div>
            
            <div class="text-center">
              <a href="${resetUrl}" class="cta-button">Reset Password</a>
            </div>
            
            <div class="email-content">
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <p>For security reasons, we recommend that you don't share this email with anyone.</p>
              
              <p><strong>Can't click the button?</strong> Copy and paste this link into your browser:</p>
              <div class="token-box">
                ${resetUrl}
              </div>
            </div>
          </div>
          
          <div class="email-footer">
            <p>© ${new Date().getFullYear()} 360-Web. All rights reserved.</p>
            <p>This is an automated message - please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to,
      subject: 'Password Reset Request - 360-Web',
      html,
    });
  }

  async sendOrderConfirmationEmail(to: string, orderData: any): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - 360-Web</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
          
          body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #4a4a4a;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          .email-header {
            background: linear-gradient(135deg, #2b9348, #007f5f);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 4px solid #007f5f;
          }
          
          .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          
          .email-body {
            padding: 30px;
          }
          
          .email-content {
            margin-bottom: 25px;
          }
          
          .email-content h2 {
            color: #2b2d42;
            font-size: 22px;
            margin-top: 0;
          }
          
          .email-content p {
            font-size: 15px;
            margin-bottom: 15px;
          }
          
          .order-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #2b9348;
          }
          
          .order-details h3 {
            margin-top: 0;
            color: #2b9348;
            font-size: 18px;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 10px;
          }
          
          .order-details p {
            margin: 8px 0;
          }
          
          .order-details strong {
            color: #212529;
          }
          
          .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #2b9348, #007f5f);
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 500;
            margin: 20px 0;
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            background: linear-gradient(135deg, #007f5f, #2b9348);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(43, 147, 72, 0.2);
          }
          
          .email-footer {
            text-align: center;
            padding: 20px;
            background: #f0fdf4;
            color: #64748b;
            font-size: 13px;
            border-top: 1px solid #dcfce7;
          }
          
          .email-footer p {
            margin: 5px 0;
          }
          
          .text-center {
            text-align: center;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              border-radius: 0;
            }
            
            .email-header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Order Confirmed! ✅</h1>
          </div>
          
          <div class="email-body">
            <div class="email-content">
              <h2>Thank you for your order!</h2>
              <p>We've received your order #${orderData.orderNumber} and it's now being processed. We'll send you a shipping confirmation email once your items are on their way.</p>
            </div>
            
            <div class="order-details">
              <h3>Order Summary</h3>
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
              <p><strong>Total Amount:</strong> $${orderData.totalAmount.toFixed(2)}</p>
            </div>
            
            <div class="text-center">
              <a href="http://localhost:4200/orders" class="cta-button">View Your Order</a>
            </div>
            
            <div class="email-content">
              <h3>What's Next?</h3>
              <p>Our team is preparing your items for shipment. You'll receive another email with tracking information once your order ships.</p>
              <p>If you have any questions about your order, please reply to this email or contact our customer service team.</p>
            </div>
          </div>
          
          <div class="email-footer">
            <p>© ${new Date().getFullYear()} 360-Web. All rights reserved.</p>
            <p>123 Web Street, Digital City, 10001</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html,
    });
  }

  async sendAdminNotificationEmail(orderData: any): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification - 360-Web</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
          
          body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #4a4a4a;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          .email-header {
            background: linear-gradient(135deg, #f72585, #b5179e);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 4px solid #b5179e;
          }
          
          .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          
          .email-body {
            padding: 30px;
          }
          
          .email-content {
            margin-bottom: 25px;
          }
          
          .email-content h2 {
            color: #2b2d42;
            font-size: 22px;
            margin-top: 0;
          }
          
          .email-content p {
            font-size: 15px;
            margin-bottom: 15px;
          }
          
          .order-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #f72585;
          }
          
          .order-details h3 {
            margin-top: 0;
            color: #f72585;
            font-size: 18px;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 10px;
          }
          
          .order-details p {
            margin: 8px 0;
          }
          
          .order-details strong {
            color: #212529;
          }
          
          .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #f72585, #b5179e);
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 500;
            margin: 20px 0;
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            background: linear-gradient(135deg, #b5179e, #f72585);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(247, 37, 133, 0.2);
          }
          
          .email-footer {
            text-align: center;
            padding: 20px;
            background: #fdf2f8;
            color: #64748b;
            font-size: 13px;
            border-top: 1px solid #fce7f3;
          }
          
          .email-footer p {
            margin: 5px 0;
          }
          
          .text-center {
            text-align: center;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              border-radius: 0;
            }
            
            .email-header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>New Order Received! 🛒</h1>
          </div>
          
          <div class="email-body">
            <div class="email-content">
              <h2>Admin Notification</h2>
              <p>A new order has been placed and requires your attention.</p>
            </div>
            
            <div class="order-details">
              <h3>Order Information</h3>
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Customer:</strong> ${orderData.user?.username || 'Guest'}</p>
              <p><strong>Email:</strong> ${orderData.user?.email || 'Not provided'}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
              <p><strong>Order Status:</strong> <span style="color: #f72585; font-weight: 600;">${orderData.status}</span></p>
              <p><strong>Total Amount:</strong> $${orderData.totalAmount.toFixed(2)}</p>
            </div>
            
            <div class="text-center">
              <a href="http://localhost:4200/admin/orders" class="cta-button">View Order in Dashboard</a>
            </div>
            
            <div class="email-content">
              <p>Please process this order according to your standard procedures. The customer will receive order status updates automatically.</p>
            </div>
          </div>
          
          <div class="email-footer">
            <p>© ${new Date().getFullYear()} 360-Web Admin System</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: adminEmail,
      subject: `New Order - ${orderData.orderNumber}`,
      html,
    });
  }
} 