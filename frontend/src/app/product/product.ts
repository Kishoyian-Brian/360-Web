import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { ProductService, Product } from '../service/product/product.service';
import { CartService } from '../service/cart/cart.service';
import { AuthService } from '../service/auth/auth.service';
import { ProductUtils } from '../shared/utils/product.utils';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;
  loading: boolean = true;
  error: string | null = null;
  addingToCart: boolean = false;

  // Expose ProductUtils to template
  ProductUtils = ProductUtils;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastService: ToastService,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get product ID from route parameter
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.error = 'Product ID not provided';
        this.loading = false;
      }
    });
  }

  loadProduct(productId: string) {
    this.loading = true;
    this.error = null;

    this.productService.getProduct(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Product not found';
        this.loading = false;
        this.toastService.error('Failed to load product');
      }
    });
  }

  goBack() {
    this.location.back();
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;

    if (this.quantity > this.product.stockQuantity) {
      this.toastService.error('Not enough stock available');
      return;
    }

    this.addingToCart = true;

    this.cartService.addToCart({
      productId: this.product.id,
      quantity: this.quantity
    }).subscribe({
      next: (cart) => {
        this.addingToCart = false;
        this.toastService.success(`Added ${this.quantity} ${this.product!.name} to cart`);
        console.log('Added to cart:', cart);
        
        // Update guest cart item details if not authenticated
        if (!this.authService.isAuthenticated && this.product) {
          this.cartService.updateGuestCartItemDetails(this.product.id, {
            name: this.product.name,
            price: this.product.price,
            image: this.product.images && this.product.images.length > 0 ? this.product.images[0] : undefined,
            stockQuantity: this.product.stockQuantity
          });
        }
      },
      error: (error) => {
        this.addingToCart = false;
        console.error('Error adding to cart:', error);
        this.toastService.error('Failed to add item to cart');
      }
    });
  }

  buyNow() {
    if (!this.product) return;

    if (this.quantity > this.product.stockQuantity) {
      this.toastService.error('Not enough stock available');
      return;
    }

    // Check if user is authenticated for checkout
    if (!this.authService.isAuthenticated) {
      this.toastService.error('Please login to proceed to checkout');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Add to cart and redirect to checkout
    this.cartService.addToCart({
      productId: this.product.id,
      quantity: this.quantity
    }).subscribe({
      next: (cart) => {
        this.toastService.success(`Added ${this.quantity} ${this.product!.name} to cart`);
        this.router.navigate(['/checkout']);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.toastService.error('Failed to add item to cart');
      }
    });
  }
}
