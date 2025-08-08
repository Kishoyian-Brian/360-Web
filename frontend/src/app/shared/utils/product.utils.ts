import { Product } from '../../service/product/product.service';

export class ProductUtils {
  /**
   * Get the primary image for a product
   * @param product - The product object
   * @returns The image URL or a placeholder
   */
  static getProductImage(product: Product): string {
    // Check if product has images array and it's not empty
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    // Fallback to single image field if available
    if (product.image) {
      return product.image;
    }
    // Default placeholder
    return 'https://via.placeholder.com/300x200/cccccc/666666?text=No+Image';
  }

  /**
   * Get the category name for a product
   * @param product - The product object
   * @returns The category name or fallback text
   */
  static getProductCategory(product: Product): string {
    // Check if product has category object
    if (product.category && product.category.name) {
      return product.category.name;
    }
    // Fallback to categoryId if no category object
    return product.categoryId || 'Unknown Category';
  }

  /**
   * Get the formatted price for a product
   * @param product - The product object
   * @returns The formatted price string
   */
  static getProductPrice(product: Product): string {
    return `$${product.price.toFixed(2)}`;
  }

  /**
   * Check if a product is in stock
   * @param product - The product object
   * @returns True if product is in stock
   */
  static isInStock(product: Product): boolean {
    return product.stockQuantity > 0;
  }

  /**
   * Get the stock status text for a product
   * @param product - The product object
   * @returns The stock status text
   */
  static getStockStatus(product: Product): string {
    if (product.stockQuantity > 10) return 'In Stock';
    if (product.stockQuantity > 0) return `Only ${product.stockQuantity} left`;
    return 'Out of Stock';
  }

  /**
   * Get the CSS class for stock status
   * @param product - The product object
   * @returns The CSS class for styling
   */
  static getStockStatusClass(product: Product): string {
    if (product.stockQuantity > 10) return 'text-green-600';
    if (product.stockQuantity > 0) return 'text-yellow-600';
    return 'text-red-600';
  }

  /**
   * Get the alt text for a product image
   * @param product - The product object
   * @returns The alt text for the image
   */
  static getProductAltText(product: Product): string {
    return product.name || 'Product Image';
  }

  /**
   * Get the balance display text for a product
   * @param product - The product object
   * @returns The balance text or empty string
   */
  static getProductBalance(product: Product): string {
    if (product.balance) {
      return product.balance.toString();
    }
    return '';
  }

  /**
   * Get the features array for a product
   * @param product - The product object
   * @returns Array of features or empty array
   */
  static getProductFeatures(product: Product): string[] {
    if (product.features && Array.isArray(product.features)) {
      return product.features;
    }
    return [];
  }
} 