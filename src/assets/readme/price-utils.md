# Price Utilities Documentation

## Overview

The `priceUtils.js` file contains utility functions for formatting prices in a standard currency format. This module is used throughout the application to ensure consistent price display.

## Functions

### formatPrice

Formats a price in standard currency format.

```javascript
formatPrice(price: number): string
```

#### Parameters

- `price` (number): The price to format

#### Returns

- (string): Formatted price string (e.g., "55,999.00")

#### Example

```javascript
import { formatPrice } from '@/utils/priceUtils'

formatPrice(55999) // Returns "55,999.00"
formatPrice(1099.56) // Returns "1,099.56"
formatPrice(null) // Returns "0.00"
```

## Usage

The price formatting utility is used in various components that display prices, including:

- Product listings
- Shopping cart
- Order summaries
- Product details

## Format Rules

The price formatting follows these rules:

1. Thousands are separated by a comma
2. Decimal separator is a period
3. Always shows 2 decimal places
4. Returns "0.00" for null/undefined values
5. Currency symbol (R) is added by the components using this utility

## Implementation Details

The formatting is achieved by:

1. Using `toLocaleString` with 'en-US' locale for standard formatting
2. Ensuring consistent decimal places
3. Using standard comma and period separators

## Best Practices

1. Always use this utility for price formatting to maintain consistency
2. Do not hardcode price formatting in components
3. The currency symbol (R) should be added by the components, not the utility
4. Use this utility for all price displays in the application
