# 360-Web Project Structure

```
360-Web/
├── 📁 backend/                          # NestJS Backend API
│   ├── 📁 prisma/                       # Database Schema & Migrations
│   │   ├── 📄 schema.prisma            # Database schema definition
│   │   ├── 📄 seed.ts                  # Database seeding script
│   │   ├── 📄 seed-admin.ts            # Admin user seeding
│   │   └── 📁 migrations/              # Database migration files
│   │       ├── 📁 20250803043154_add_vouches_table/
│   │       ├── 📁 20250803094900_add_cart_and_payment_models/
│   │       ├── 📁 20250804165238_make_video_url_optional/
│   │       ├── 📁 20250809205044_add_crypto_accounts/
│   │       ├── 📁 20250809210000_add_payment_proof_to_orders/
│   │       ├── 📁 20250810183355_add_user_balance_system/
│   │       └── 📁 20250811100000_add_topup_requests/
│   │
│   ├── 📁 src/                          # Source Code
│   │   ├── 📁 analytics/               # Analytics Module
│   │   │   ├── 📄 analytics.controller.ts
│   │   │   ├── 📄 analytics.module.ts
│   │   │   └── 📄 analytics.service.ts
│   │   │
│   │   ├── 📁 auth/                    # Authentication Module
│   │   │   ├── 📁 decorators/
│   │   │   │   └── 📄 match.decorator.ts
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 login.dto.ts
│   │   │   │   └── 📄 register.dto.ts
│   │   │   ├── 📁 guards/
│   │   │   │   ├── 📄 admin.guard.ts
│   │   │   │   └── 📄 jwt-auth.guard.ts
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 auth.module.ts
│   │   │   └── 📄 auth.service.ts
│   │   │
│   │   ├── 📁 blog/                    # Blog Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 blog-filter.dto.ts
│   │   │   │   ├── 📄 blog-post-response.dto.ts
│   │   │   │   └── 📄 create-blog-post.dto.ts
│   │   │   ├── 📄 blog.controller.ts
│   │   │   ├── 📄 blog.module.ts
│   │   │   └── 📄 blog.service.ts
│   │   │
│   │   ├── 📁 cart/                    # Shopping Cart Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 add-to-cart.dto.ts
│   │   │   │   ├── 📄 cart-item-response.dto.ts
│   │   │   │   └── 📄 cart-response.dto.ts
│   │   │   ├── 📄 cart.controller.ts
│   │   │   ├── 📄 cart.module.ts
│   │   │   └── 📄 cart.service.ts
│   │   │
│   │   ├── 📁 category/                # Product Categories Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 category-filter.dto.ts
│   │   │   │   ├── 📄 category-response.dto.ts
│   │   │   │   └── 📄 create-category.dto.ts
│   │   │   ├── 📄 category-seeder.service.ts
│   │   │   ├── 📄 category.controller.ts
│   │   │   ├── 📄 category.module.ts
│   │   │   └── 📄 category.service.ts
│   │   │
│   │   ├── 📁 config/                  # Configuration Files
│   │   │   ├── 📄 app.config.ts
│   │   │   ├── 📄 cloudinary.config.ts
│   │   │   └── 📄 database.config.ts
│   │   │
│   │   ├── 📁 crypto/                  # Cryptocurrency Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create-crypto-account.dto.ts
│   │   │   │   ├── 📄 crypto-account-response.dto.ts
│   │   │   │   └── 📄 update-crypto-account.dto.ts
│   │   │   ├── 📄 crypto.controller.ts
│   │   │   ├── 📄 crypto.module.ts
│   │   │   └── 📄 crypto.service.ts
│   │   │
│   │   ├── 📁 email/                   # Email Service Module
│   │   │   ├── 📁 dto/
│   │   │   │   └── 📄 send-email.dto.ts
│   │   │   ├── 📄 email.controller.ts
│   │   │   ├── 📄 email.module.ts
│   │   │   └── 📄 email.service.ts
│   │   │
│   │   ├── 📁 order/                   # Order Management Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create-order.dto.ts
│   │   │   │   ├── 📄 order-filter.dto.ts
│   │   │   │   └── 📄 order-response.dto.ts
│   │   │   ├── 📄 order.controller.ts
│   │   │   ├── 📄 order.module.ts
│   │   │   └── 📄 order.service.ts
│   │   │
│   │   ├── 📁 payment/                 # Payment Processing Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create-payment.dto.ts
│   │   │   │   └── 📄 payment-response.dto.ts
│   │   │   ├── 📄 payment.controller.ts
│   │   │   ├── 📄 payment.module.ts
│   │   │   └── 📄 payment.service.ts
│   │   │
│   │   ├── 📁 prisma/                  # Database Service
│   │   │   ├── 📄 prisma.module.ts
│   │   │   └── 📄 prisma.service.ts
│   │   │
│   │   ├── 📁 product/                 # Product Management Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create-product.dto.ts
│   │   │   │   ├── 📄 product-filter.dto.ts
│   │   │   │   └── 📄 product-response.dto.ts
│   │   │   ├── 📄 product.controller.ts
│   │   │   ├── 📄 product.module.ts
│   │   │   └── 📄 product.service.ts
│   │   │
│   │   ├── 📁 static-pages/            # Static Pages Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create-static-page.dto.ts
│   │   │   │   ├── 📄 static-page-response.dto.ts
│   │   │   │   └── 📄 update-static-page.dto.ts
│   │   │   ├── 📄 static-pages.controller.ts
│   │   │   ├── 📄 static-pages.module.ts
│   │   │   └── 📄 static-pages.service.ts
│   │   │
│   │   ├── 📁 topup/                   # Balance Topup Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create-topup-request.dto.ts
│   │   │   │   ├── 📄 topup-filter.dto.ts
│   │   │   │   └── 📄 topup-response.dto.ts
│   │   │   ├── 📄 topup.controller.ts
│   │   │   ├── 📄 topup.module.ts
│   │   │   └── 📄 topup.service.ts
│   │   │
│   │   ├── 📁 upload/                  # File Upload Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 file-response.dto.ts
│   │   │   │   └── 📄 upload-file.dto.ts
│   │   │   ├── 📄 upload.controller.ts
│   │   │   ├── 📄 upload.module.ts
│   │   │   └── 📄 upload.service.ts
│   │   │
│   │   ├── 📁 user/                    # User Management Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 balance-history.dto.ts
│   │   │   │   ├── 📄 create-user.dto.ts
│   │   │   │   └── 📄 password-reset.dto.ts
│   │   │   ├── 📄 user.controller.ts
│   │   │   ├── 📄 user.module.ts
│   │   │   └── 📄 user.service.ts
│   │   │
│   │   ├── 📁 video/                   # Video Management Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create-video.dto.ts
│   │   │   │   ├── 📄 update-video.dto.ts
│   │   │   │   └── 📄 video-response.dto.ts
│   │   │   ├── 📄 video.controller.ts
│   │   │   ├── 📄 video.module.ts
│   │   │   └── 📄 video.service.ts
│   │   │
│   │   ├── 📁 vouch/                   # Vouch System Module
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create-vouch.dto.ts
│   │   │   │   ├── 📄 update-vouch.dto.ts
│   │   │   │   └── 📄 vouch-filter.dto.ts
│   │   │   ├── 📄 vouch-seeder.service.ts
│   │   │   ├── 📄 vouch.controller.ts
│   │   │   ├── 📄 vouch.module.ts
│   │   │   └── 📄 vouch.service.ts
│   │   │
│   │   ├── 📄 app.controller.ts         # Main application controller
│   │   ├── 📄 app.controller.spec.ts   # App controller tests
│   │   ├── 📄 app.module.ts            # Root application module
│   │   └── 📄 main.ts                 # Application entry point
│   │
│   ├── 📁 rest-client/                # API Testing Files
│   │   ├── 📄 admin-product-management.md
│   │   ├── 📄 blog-api.http
│   │   ├── 📄 blog-test.http
│   │   └── 📄 [+21 files]              # Additional HTTP test files
│   │
│   ├── 📁 test/                       # E2E Tests
│   │   ├── 📄 app.e2e-spec.ts
│   │   └── 📄 jest-e2e.json
│   │
│   ├── 📁 uploads/                    # Uploaded Files Storage
│   │   └── 📄 [+50 files]             # Images, videos, documents
│   │
│   ├── 📄 .env                        # Environment variables
│   ├── 📄 eslint.config.mjs           # ESLint configuration
│   ├── 📄 flow.txt                    # Development flow documentation
│   ├── 📄 nest-cli.json              # NestJS CLI configuration
│   ├── 📄 package.json               # Node.js dependencies
│   ├── 📄 package-lock.json          # Dependency lock file
│   └── 📄 proper-test-image.png      # Test image file
│
├── 📁 frontend/                        # Angular Frontend Application
│   ├── 📁 src/                        # Source Code
│   │   ├── 📁 app/                    # Main Application
│   │   │   ├── 📁 admin/              # Admin Panel
│   │   │   │   ├── 📄 admin.css
│   │   │   │   ├── 📄 admin.html
│   │   │   │   ├── 📄 admin.spec.ts
│   │   │   │   └── 📄 admin.ts
│   │   │   │
│   │   │   ├── 📁 blog/               # Blog System
│   │   │   │   ├── 📁 blog-article/
│   │   │   │   │   ├── 📄 blog-article.component.css
│   │   │   │   │   ├── 📄 blog-article.component.html
│   │   │   │   │   ├── 📄 blog-article.component.spec.ts
│   │   │   │   │   └── 📄 blog-article.component.ts
│   │   │   │   ├── 📄 blog.css
│   │   │   │   ├── 📄 blog.html
│   │   │   │   ├── 📄 blog.spec.ts
│   │   │   │   └── 📄 blog.ts
│   │   │   │
│   │   │   ├── 📁 cart/               # Shopping Cart
│   │   │   │   ├── 📄 cart.css
│   │   │   │   ├── 📄 cart.html
│   │   │   │   └── 📄 cart.ts
│   │   │   │
│   │   │   ├── 📁 category/           # Product Categories
│   │   │   │   ├── 📁 bank-logs/      # Bank Logs Category
│   │   │   │   ├── 📁 bitcoin-log/    # Bitcoin Logs Category
│   │   │   │   ├── 📁 carded/         # Carded Products
│   │   │   │   ├── 📁 carded-products/
│   │   │   │   ├── 📁 cashapp-log/    # CashApp Logs
│   │   │   │   ├── 📁 cc-cvv/         # Credit Card CVV
│   │   │   │   ├── 📁 clips/          # Video Clips
│   │   │   │   ├── 📁 clone/          # Cloned Accounts
│   │   │   │   ├── 📁 deposit-check/  # Deposit Verification
│   │   │   │   ├── 📁 e-gift-cards/   # E-Gift Cards
│   │   │   │   ├── 📁 fraud-cards/    # Fraud Cards
│   │   │   │   ├── 📁 fullz/          # Complete Info Packages
│   │   │   │   ├── 📁 linkable/       # Linkable Payment Methods
│   │   │   │   ├── 📁 paypal-log/     # PayPal Logs
│   │   │   │   ├── 📁 shake/           # Shake Services
│   │   │   │   ├── 📁 stealth-accounts/ # Stealth Accounts
│   │   │   │   ├── 📁 tools/          # Tools & Utilities
│   │   │   │   └── 📁 transfers/      # Money Transfers
│   │   │   │
│   │   │   ├── 📁 components/         # Reusable Components
│   │   │   │   └── 📁 toast/          # Toast Notifications
│   │   │   │       └── 📄 toast.component.ts
│   │   │   │
│   │   │   ├── 📁 connection-test/     # API Connection Testing
│   │   │   │   └── 📄 connection-test.ts
│   │   │   │
│   │   │   ├── 📁 footer/             # Site Footer
│   │   │   │   ├── 📄 footer.css
│   │   │   │   ├── 📄 footer.html
│   │   │   │   ├── 📄 footer.spec.ts
│   │   │   │   └── 📄 footer.ts
│   │   │   │
│   │   │   ├── 📁 guards/              # Route Guards
│   │   │   │   ├── 📄 admin.guard.ts
│   │   │   │   ├── 📄 auth.guard.ts
│   │   │   │   └── 📄 cart-admin.guard.ts
│   │   │   │
│   │   │   ├── 📁 header/             # Site Header
│   │   │   │   ├── 📄 header.css
│   │   │   │   ├── 📄 header.html
│   │   │   │   ├── 📄 header.spec.ts
│   │   │   │   └── 📄 header.ts
│   │   │   │
│   │   │   ├── 📁 home/               # Homepage
│   │   │   │   ├── 📄 home.css
│   │   │   │   ├── 📄 home.html
│   │   │   │   ├── 📄 home.spec.ts
│   │   │   │   └── 📄 home.ts
│   │   │   │
│   │   │   ├── 📁 layout/             # Layout Components
│   │   │   │   ├── 📄 layout.css
│   │   │   │   ├── 📄 layout.html
│   │   │   │   ├── 📄 layout.spec.ts
│   │   │   │   └── 📄 layout.ts
│   │   │   │
│   │   │   ├── 📁 linkable/           # Linkable Payment Methods
│   │   │   │   ├── 📁 applepay/       # Apple Pay
│   │   │   │   ├── 📁 cashapp/        # CashApp
│   │   │   │   ├── 📁 googlepay/      # Google Pay
│   │   │   │   ├── 📁 paypal/         # PayPal
│   │   │   │   └── 📁 venmo/          # Venmo
│   │   │   │
│   │   │   ├── 📁 morelogs/           # Additional Log Categories
│   │   │   │   ├── 📁 africa-cards/   # Africa Credit Cards
│   │   │   │   ├── 📁 australia-cards/ # Australia Credit Cards
│   │   │   │   ├── 📁 canada-banks/   # Canada Banks
│   │   │   │   ├── 📁 canada-cards/   # Canada Credit Cards
│   │   │   │   ├── 📁 credit-unions/  # Credit Unions
│   │   │   │   ├── 📁 crypto-logs/    # Cryptocurrency Logs
│   │   │   │   ├── 📁 europe-cards/    # Europe Credit Cards
│   │   │   │   ├── 📁 uk-banks/       # UK Banks
│   │   │   │   ├── 📁 uk-cards/       # UK Credit Cards
│   │   │   │   ├── 📁 usa-banks/      # USA Banks
│   │   │   │   └── 📁 usa-cards/      # USA Credit Cards
│   │   │   │
│   │   │   ├── 📁 my-account/         # User Account Management
│   │   │   │   ├── 📄 my-account.component.css
│   │   │   │   ├── 📄 my-account.component.html
│   │   │   │   ├── 📄 my-account.component.spec.ts
│   │   │   │   └── 📄 my-account.component.ts
│   │   │   │
│   │   │   ├── 📁 order/              # Order Management
│   │   │   │   ├── 📄 order.component.css
│   │   │   │   ├── 📄 order.component.html
│   │   │   │   ├── 📄 order.component.spec.ts
│   │   │   │   └── 📄 order.component.ts
│   │   │   │
│   │   │   ├── 📁 pages/              # Static Pages
│   │   │   │   ├── 📁 cashout-clips/  # Cashout Clips
│   │   │   │   ├── 📁 checkout/       # Checkout Process
│   │   │   │   ├── 📁 login/          # Login Page
│   │   │   │   └── 📁 register/       # Registration Page
│   │   │   │
│   │   │   ├── 📁 product/            # Product Details
│   │   │   │   ├── 📄 product.component.css
│   │   │   │   ├── 📄 product.component.html
│   │   │   │   ├── 📄 product.component.spec.ts
│   │   │   │   └── 📄 product.component.ts
│   │   │   │
│   │   │   ├── 📁 service/            # Angular Services
│   │   │   │   ├── 📁 admin/          # Admin Service
│   │   │   │   ├── 📁 auth/           # Authentication Service
│   │   │   │   ├── 📁 blog/           # Blog Service
│   │   │   │   ├── 📁 cart/           # Cart Service
│   │   │   │   ├── 📁 category/       # Category Service
│   │   │   │   ├── 📁 crypto/         # Crypto Service
│   │   │   │   ├── 📁 order/          # Order Service
│   │   │   │   ├── 📁 product/        # Product Service
│   │   │   │   ├── 📁 user/           # User Service
│   │   │   │   ├── 📁 video/          # Video Service
│   │   │   │   └── 📁 vouch/          # Vouch Service
│   │   │   │
│   │   │   ├── 📁 services/           # Additional Services
│   │   │   │   ├── 📄 qr-code.service.ts # QR Code Generation
│   │   │   │   └── 📄 toast.service.ts  # Toast Notifications
│   │   │   │
│   │   │   ├── 📁 shared/             # Shared Components
│   │   │   │   ├── 📁 components/
│   │   │   │   │   └── 📁 product-card/ # Product Card Component
│   │   │   │   ├── 📁 sidebar/        # Sidebar Component
│   │   │   │   └── 📁 utils/          # Utility Functions
│   │   │   │
│   │   │   ├── 📁 shop/               # Shop/Store Front
│   │   │   │   ├── 📄 shop.component.css
│   │   │   │   ├── 📄 shop.component.html
│   │   │   │   ├── 📄 shop.component.spec.ts
│   │   │   │   └── 📄 shop.component.ts
│   │   │   │
│   │   │   ├── 📁 topup/              # Balance Topup
│   │   │   │   ├── 📄 topup.component.css
│   │   │   │   ├── 📄 topup.component.html
│   │   │   │   ├── 📄 topup.component.spec.ts
│   │   │   │   └── 📄 topup.component.ts
│   │   │   │
│   │   │   ├── 📁 transfers/          # Money Transfer Services
│   │   │   │   ├── 📁 applepay/       # Apple Pay Transfers
│   │   │   │   ├── 📁 cashapp/        # CashApp Transfers
│   │   │   │   ├── 📁 googlepay/      # Google Pay Transfers
│   │   │   │   ├── 📁 paypal/         # PayPal Transfers
│   │   │   │   ├── 📁 venmo/          # Venmo Transfers
│   │   │   │   └── 📁 zelle/          # Zelle Transfers
│   │   │   │
│   │   │   ├── 📁 voucher/             # Voucher System
│   │   │   │   ├── 📄 voucher.component.css
│   │   │   │   ├── 📄 voucher.component.html
│   │   │   │   ├── 📄 voucher.component.spec.ts
│   │   │   │   └── 📄 voucher.component.ts
│   │   │   │
│   │   │   ├── 📄 app.config.ts       # App configuration
│   │   │   ├── 📄 app.css             # Global styles
│   │   │   ├── 📄 app.html            # Root template
│   │   │   ├── 📄 app.routes.ts       # Application routes
│   │   │   └── 📄 app.ts              # Root component
│   │   │
│   │   ├── 📁 environments/           # Environment Configurations
│   │   │   ├── 📄 environment.ts      # Development environment
│   │   │   └── 📄 environment.prod.ts # Production environment
│   │   │
│   │   ├── 📄 index.html              # Main HTML file
│   │   ├── 📄 main.ts                 # Application entry point
│   │   └── 📄 styles.css              # Global CSS styles
│   │
│   ├── 📁 public/                     # Static Assets
│   │   └── 📄 favicon.ico             # Site favicon
│   │
│   ├── 📁 .angular/                   # Angular Cache
│   │   └── 📁 cache/                  # Build cache files
│   │
│   ├── 📁 .vscode/                    # VS Code Configuration
│   │   ├── 📄 extensions.json         # Recommended extensions
│   │   ├── 📄 tasks.json              # Build tasks
│   │   └── 📄 launch.json             # Debug configuration
│   │
│   ├── 📄 angular.json                # Angular CLI configuration
│   ├── 📄 FRONTEND_BACKEND_CHECKLIST.md # Development checklist
│   ├── 📄 FRONTEND_BACKEND_CONNECTION_REPORT.md # Connection report
│   ├── 📄 package.json                # Node.js dependencies
│   ├── 📄 package-lock.json           # Dependency lock file
│   ├── 📄 tailwind.config.js          # Tailwind CSS configuration
│   └── 📄 tsconfig.json               # TypeScript configuration
│
├── 📁 .vscode/                        # VS Code Workspace Settings
│   └── 📄 settings.json               # Workspace configuration
│
└── 📄 README.md                       # Project documentation

## 📊 Project Statistics

### Backend (NestJS)
- **Modules**: 15+ feature modules
- **Controllers**: 15+ REST API controllers
- **Services**: 15+ business logic services
- **DTOs**: 30+ data transfer objects
- **Database**: PostgreSQL with Prisma ORM
- **Features**: Authentication, E-commerce, Blog, Crypto, Admin Panel

### Frontend (Angular)
- **Components**: 50+ Angular components
- **Services**: 10+ Angular services
- **Pages**: 20+ different pages/routes
- **Categories**: 15+ product categories
- **Features**: Responsive design, QR codes, Admin panel, User management

### Key Features
- 🔐 **Authentication & Authorization** (JWT-based)
- 🛒 **E-commerce Platform** (Products, Cart, Orders)
- 💰 **Cryptocurrency Payments** (BTC, ETH, USDT, LTC)
- 📱 **QR Code Generation** (Wallet addresses)
- 👨‍💼 **Admin Panel** (Full management system)
- 📝 **Blog System** (Content management)
- 📧 **Email Service** (Notifications)
- 📊 **Analytics** (Usage tracking)
- 🎥 **Video Management** (Product videos)
- ⭐ **Vouch System** (User reviews)
- 💳 **Balance System** (User wallets)
- 🔄 **Topup System** (Balance recharge)

### Technology Stack
- **Backend**: NestJS, Prisma, PostgreSQL, JWT, Cloudinary
- **Frontend**: Angular, Tailwind CSS, TypeScript
- **Deployment**: Railway (Backend), Vercel/Netlify (Frontend)
- **Tools**: ESLint, Prettier, Swagger API docs
