#!/bin/bash

# Script to fix product display issues across all components - Version 2
# This script will properly update all HTML templates and TypeScript components

echo "🔧 Fixing product display issues across all components (Version 2)..."

# Function to fix a single HTML file
fix_html_file() {
    local file="$1"
    echo "Fixing HTML: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Replace product.image with ProductUtils.getProductImage(product)
    sed -i 's/\[src\]="product\.image"/[src]="ProductUtils.getProductImage(product)"/g' "$file"
    
    # Replace product.alt with ProductUtils.getProductAltText(product)
    sed -i 's/\[alt\]="product\.alt"/[alt]="ProductUtils.getProductAltText(product)"/g' "$file"
    
    # Replace product.category with ProductUtils.getProductCategory(product)
    sed -i 's/{{ product\.category }}/{{ ProductUtils.getProductCategory(product) }}/g' "$file"
    
    # Replace product.features with ProductUtils.getProductFeatures(product)
    sed -i 's/let feature of product\.features/let feature of ProductUtils.getProductFeatures(product)/g' "$file"
    
    echo "✅ Fixed HTML: $file"
}

# Function to fix a single TypeScript file
fix_ts_file() {
    local file="$1"
    echo "Fixing TypeScript: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Remove any existing ProductUtils imports to avoid duplicates
    sed -i '/import.*ProductUtils.*from.*product\.utils/d' "$file"
    
    # Add ProductUtils import after the last import statement
    sed -i '/^import.*from.*$/a import { ProductUtils } from "../../shared/utils/product.utils";' "$file"
    
    # Remove any existing ProductUtils = ProductUtils lines
    sed -i '/ProductUtils = ProductUtils/d' "$file"
    
    # Add ProductUtils to component class after the properties section
    sed -i '/export class.*{/a \  ProductUtils = ProductUtils;' "$file"
    
    echo "✅ Fixed TypeScript: $file"
}

# List of HTML files to fix
html_files=(
    "frontend/src/app/linkable/venmo/venmo.html"
    "frontend/src/app/linkable/cashapp/cashapp.html"
    "frontend/src/app/linkable/googlepay/googlepay.html"
    "frontend/src/app/linkable/applepay/applepay.html"
    "frontend/src/app/linkable/paypal/paypal.html"
    "frontend/src/app/category/carded-products/carded-products.html"
    "frontend/src/app/category/fraud-cards/fraud-cards.html"
    "frontend/src/app/category/linkable/linkable.html"
    "frontend/src/app/category/deposit-check/deposit-check.html"
    "frontend/src/app/category/clips/clips.html"
    "frontend/src/app/category/fullz/fullz.html"
    "frontend/src/app/category/stealth-accounts/stealth-accounts.html"
    "frontend/src/app/category/tools/tools.html"
    "frontend/src/app/category/cashapp-log/cashapp-log.html"
    "frontend/src/app/category/e-gift-cards/e-gift-cards.html"
    "frontend/src/app/category/clone/clone.html"
    "frontend/src/app/category/transfers/transfers.html"
    "frontend/src/app/category/paypal-log/paypal-log.html"
    "frontend/src/app/category/carded/carded.html"
    "frontend/src/app/category/cc-cvv/cc-cvv.html"
    "frontend/src/app/category/shake/shake.html"
    "frontend/src/app/product/product.html"
    "frontend/src/app/transfers/applepay/applepay.html"
    "frontend/src/app/transfers/venmo/venmo.html"
    "frontend/src/app/transfers/cashapp/cashapp.html"
    "frontend/src/app/transfers/zelle/zelle.html"
    "frontend/src/app/transfers/paypal/paypal.html"
    "frontend/src/app/transfers/googlepay/googlepay.html"
)

# List of TypeScript files to fix
ts_files=(
    "frontend/src/app/linkable/venmo/venmo.ts"
    "frontend/src/app/linkable/cashapp/cashapp.ts"
    "frontend/src/app/linkable/googlepay/googlepay.ts"
    "frontend/src/app/linkable/applepay/applepay.ts"
    "frontend/src/app/linkable/paypal/paypal.ts"
    "frontend/src/app/category/carded-products/carded-products.ts"
    "frontend/src/app/category/fraud-cards/fraud-cards.ts"
    "frontend/src/app/category/linkable/linkable.ts"
    "frontend/src/app/category/deposit-check/deposit-check.ts"
    "frontend/src/app/category/clips/clips.ts"
    "frontend/src/app/category/fullz/fullz.ts"
    "frontend/src/app/category/stealth-accounts/stealth-accounts.ts"
    "frontend/src/app/category/tools/tools.ts"
    "frontend/src/app/category/cashapp-log/cashapp-log.ts"
    "frontend/src/app/category/e-gift-cards/e-gift-cards.ts"
    "frontend/src/app/category/clone/clone.ts"
    "frontend/src/app/category/transfers/transfers.ts"
    "frontend/src/app/category/paypal-log/paypal-log.ts"
    "frontend/src/app/category/carded/carded.ts"
    "frontend/src/app/category/cc-cvv/cc-cvv.ts"
    "frontend/src/app/category/shake/shake.ts"
    "frontend/src/app/product/product.ts"
    "frontend/src/app/transfers/applepay/applepay.ts"
    "frontend/src/app/transfers/venmo/venmo.ts"
    "frontend/src/app/transfers/cashapp/cashapp.ts"
    "frontend/src/app/transfers/zelle/zelle.ts"
    "frontend/src/app/transfers/paypal/paypal.ts"
    "frontend/src/app/transfers/googlepay/googlepay.ts"
)

# Fix HTML files
echo "📝 Fixing HTML templates..."
for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        fix_html_file "$file"
    else
        echo "⚠️  File not found: $file"
    fi
done

# Fix TypeScript files
echo "🔧 Fixing TypeScript components..."
for file in "${ts_files[@]}"; do
    if [ -f "$file" ]; then
        fix_ts_file "$file"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo "🎉 Product display fixes completed!"
echo "📋 Summary:"
echo "   - Fixed HTML templates: ${#html_files[@]} files"
echo "   - Fixed TypeScript components: ${#ts_files[@]} files"
echo "   - Backups created with .backup extension"
echo ""
echo "🔍 Next steps:"
echo "   1. Review the changes in the modified files"
echo "   2. Test the application to ensure everything works"
echo "   3. Run: npx ng build --configuration development"
echo "   4. If issues arise, restore from .backup files" 