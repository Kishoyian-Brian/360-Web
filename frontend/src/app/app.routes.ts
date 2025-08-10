import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ProductComponent } from './product/product';
import { CartComponent } from './cart/cart';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Checkout } from './pages/checkout/checkout';
import { CashoutClips } from './pages/cashout-clips/cashout-clips';
import { CcCvv } from './category/cc-cvv/cc-cvv';
import { BankLogs } from './category/bank-logs/bank-logs';
import { StealthAccounts } from './category/stealth-accounts/stealth-accounts';
import { Fullz } from './category/fullz/fullz';
import { FraudCards } from './category/fraud-cards/fraud-cards';
import { Tools } from './category/tools/tools';
import { EGiftCards } from './category/e-gift-cards/e-gift-cards';
import { DepositCheck } from './category/deposit-check/deposit-check';
import { Transfers } from './category/transfers/transfers';
import { Clone } from './category/clone/clone';
import { CardedProducts } from './category/carded-products/carded-products';
import { Clips } from './category/clips/clips';
import { Shake } from './category/shake/shake';
import { CashappLog } from './category/cashapp-log/cashapp-log';
import { PaypalLog } from './category/paypal-log/paypal-log';
import { Linkable } from './category/linkable/linkable';
import { BitcoinLog } from './category/bitcoin-log/bitcoin-log';
import { ShopComponent } from './shop/shop-fixed';
import { Voucher } from './voucher/voucher';
import { Blog } from './blog/blog';
import { BlogArticle } from './blog/blog-article/blog-article';
import { OrderComponent } from './order/order';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CartAdminGuard } from './guards/cart-admin.guard';
import { ConnectionTestComponent } from './connection-test/connection-test';
import { MyAccountComponent } from './my-account/my-account';
import { TopupComponent } from './topup/topup';

// Admin Components
import { Admin } from './admin/admin';

// More Logs Components
import { UsaBanks } from './morelogs/usa-banks/usa-banks';
import { UkBanks } from './morelogs/uk-banks/uk-banks';
import { CanadaBanks } from './morelogs/canada-banks/canada-banks';
import { UsaCards } from './morelogs/usa-cards/usa-cards';
import { UkCards } from './morelogs/uk-cards/uk-cards';
import { EuropeCards } from './morelogs/europe-cards/europe-cards';
import { AfricaCards } from './morelogs/africa-cards/africa-cards';
import { CanadaCards } from './morelogs/canada-cards/canada-cards';
import { AustraliaCards } from './morelogs/australia-cards/australia-cards';
import { CreditUnions } from './morelogs/credit-unions/credit-unions';
import { CryptoLogs } from './morelogs/crypto-logs/crypto-logs';


// Linkables Components
import { Cashapp as LinkableCashapp } from './linkable/cashapp/cashapp';
import { LinkablePaypal } from './linkable/paypal/paypal';
import { LinkableVenmo } from './linkable/venmo/venmo';
import { LinkableApplepay } from './linkable/applepay/applepay';
import { LinkableGooglepay } from './linkable/googlepay/googlepay';

// Transfers Components
import { Cashapp as TransferCashapp } from './transfers/cashapp/cashapp';
import { Paypal as TransferPaypal } from './transfers/paypal/paypal';
import { Venmo as TransferVenmo } from './transfers/venmo/venmo';
import { Zelle } from './transfers/zelle/zelle';
import { Applepay as TransferApplepay } from './transfers/applepay/applepay';
import { Googlepay as TransferGooglepay } from './transfers/googlepay/googlepay';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route - home page
  { path: 'home', component: HomeComponent }, // Explicit home route
  { path: 'product/:id', component: ProductComponent }, // Product details route
  { path: 'cart', component: CartComponent }, // Cart page - accessible to all users
  { path: 'login', component: Login }, // Login page
  { path: 'register', component: Register }, // Register page
  { path: 'checkout', component: Checkout, canActivate: [AuthGuard] }, // Checkout page - requires login
  { path: 'cashout-clips', component: CashoutClips }, // Cashout clips page
  { path: 'test-connections', component: ConnectionTestComponent }, // Connection test page

  // Admin routes - protected with AdminGuard
  { path: 'admin', component: Admin, canActivate: [AdminGuard] },

  // Category routes
  { path: 'category/cc-cvv', component: CcCvv },
  { path: 'category/bank-logs', component: BankLogs },
  { path: 'category/stealth-accounts', component: StealthAccounts },
  { path: 'category/fullz', component: Fullz },
  { path: 'category/fraud-guides', component: FraudCards },
  { path: 'category/tools', component: Tools },
  { path: 'category/e-gift-cards', component: EGiftCards },
  { path: 'category/deposit-checks', component: DepositCheck },
  { path: 'category/transfers', component: Transfers },
  { path: 'category/clones', component: Clone },
  { path: 'category/carded-products', component: CardedProducts },
  { path: 'category/spamming', component: Clips },
  { path: 'category/shake', component: Shake },
  { path: 'category/cashapp-log', component: CashappLog },
  { path: 'category/paypal-log', component: PaypalLog },
  { path: 'category/linkable', component: Linkable },
  { path: 'category/bitcoin-log', component: BitcoinLog },

  // More Logs routes (using actual components)
  { path: 'more-logs/usa-banks', component: UsaBanks },
  { path: 'more-logs/uk-banks', component: UkBanks },
  { path: 'more-logs/canada-banks', component: CanadaBanks },
  { path: 'more-logs/usa-cards', component: UsaCards },
  { path: 'more-logs/uk-cards', component: UkCards },
  { path: 'more-logs/europe-cards', component: EuropeCards },
  { path: 'more-logs/africa-cards', component: AfricaCards },
  { path: 'more-logs/canada-cards', component: CanadaCards },
  { path: 'more-logs/australia-cards', component: AustraliaCards },
  { path: 'more-logs/credit-union', component: CreditUnions },
  { path: 'more-logs/crypto-logs', component: CryptoLogs },

  // Linkables routes (using actual components)
  { path: 'linkable/cashapp', component: LinkableCashapp },
  { path: 'linkable/paypal', component: LinkablePaypal },
  { path: 'linkable/venmo', component: LinkableVenmo },
  { path: 'linkable/applepay', component: LinkableApplepay },
  { path: 'linkable/googlepay', component: LinkableGooglepay },

  // Transfers routes (using actual components)
  { path: 'transfers/cashapp', component: TransferCashapp },
  { path: 'transfers/paypal', component: TransferPaypal },
  { path: 'transfers/venmo', component: TransferVenmo },
  { path: 'transfers/zelle', component: Zelle },
  { path: 'transfers/applepay', component: TransferApplepay },
  { path: 'transfers/googlepay', component: TransferGooglepay },

  // Other routes
  { path: 'shop', component: ShopComponent },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuard] }, // Orders page - protected
  { path: 'voucher', component: Voucher },
  { path: 'blog', component: Blog },
  { path: 'blog/:slug', component: BlogArticle }, // Individual blog article route
  { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: 'topup', component: TopupComponent, canActivate: [AuthGuard] }, // My Account page - protected
];
