import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../service/product/product.service';
import { ProductUtils } from '../../utils/product.utils';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div class="p-0">
        <div class="relative">
          <!-- Status badges -->
          <span
            *ngIf="showVerifiedBadge"
            class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded"
          >
            Verified
          </span>
          <span
            *ngIf="showHardwareBadge"
            class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded"
          >
            Hardware
          </span>
          <span
            *ngIf="showActiveBadge"
            class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded"
          >
            Active
          </span>
          
          <!-- Product Image -->
          <img
            [src]="ProductUtils.getProductImage(product)"
            [alt]="ProductUtils.getProductAltText(product)"
            class="w-full h-36 object-contain mb-3 cursor-pointer"
            (click)="onProductClick()"
          />
        </div>
        
        <!-- Product Info -->
        <div [class]="infoBackgroundClass + ' p-4 rounded'">
          <div class="text-sm mb-1">
            <small [class]="categoryTextClass">
              {{ ProductUtils.getProductCategory(product) }}
            </small>
          </div>
          
          <h3
            class="text-base font-medium text-gray-900 mb-2 cursor-pointer"
            (click)="onProductClick()"
          >
            {{ product.name }}
          </h3>
          
          <!-- Balance display -->
          <div *ngIf="showBalance" class="text-sm text-blue-600 mb-2">
            <strong>Balance: {{ ProductUtils.getProductBalance(product) }}</strong>
          </div>
          
          <!-- Features display -->
          <div *ngIf="showFeatures" class="text-xs text-gray-500 mb-2">
            <span
              *ngFor="let feature of ProductUtils.getProductFeatures(product); let last = last"
            >
              {{ feature }}{{ !last ? ' • ' : '' }}
            </span>
          </div>
          
          <!-- Price -->
          <div class="flex justify-center items-center">
            <span class="text-gray-900 font-bold">
              {{ ProductUtils.getProductPrice(product) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showVerifiedBadge: boolean = false;
  @Input() showHardwareBadge: boolean = false;
  @Input() showActiveBadge: boolean = false;
  @Input() showBalance: boolean = false;
  @Input() showFeatures: boolean = false;
  @Input() infoBackgroundClass: string = 'bg-gray-500';
  @Input() categoryTextClass: string = 'text-gray-300';
  
  @Output() productClick = new EventEmitter<Product>();

  // Expose ProductUtils to template
  ProductUtils = ProductUtils;

  onProductClick() {
    this.productClick.emit(this.product);
  }
} 