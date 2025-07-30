import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ProductComponent } from './product/product';
import { CartComponent } from './cart/cart';
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

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route - home page
  { path: 'home', component: HomeComponent }, // Explicit home route
  { path: 'product/:id', component: ProductComponent }, // Product details route
  { path: 'cart', component: CartComponent }, // Cart page 
  
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
  
  { path: '**', redirectTo: '' } // Redirect any unknown routes to home
];
