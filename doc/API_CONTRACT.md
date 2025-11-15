# Backend API Contract

## Overview

The Syngenta Product Verification SDK requires a backend API endpoint for product verification. This document specifies the required API contract.

## Base Configuration

```typescript
const client = new BackendClient({
  baseUrl: 'https://api.syngenta.com', // Your API base URL
  authToken: 'your-jwt-token', // JWT authentication token
  timeout: 30000, // Request timeout (30 seconds)
  retryAttempts: 3, // Number of retry attempts
});
```

## Endpoint Specification

### POST /api/verify

Verify a scanned product code and return product information.

#### Request

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  (if authToken provided in config)
```

**Body:**

```json
{
  "code": "SYN-TRACKING-ID-123",
  "codeType": "QR",
  "retailerId": "RETAILER-456"
}
```

**Request Schema:**

```typescript
interface VerificationRequest {
  code: string; // Scanned code (required)
  codeType?: 'QR' | 'DataMatrix' | 'EAN' | 'UPC'; // Code type (optional)
  retailerId?: string; // Retailer identifier (optional)
}
```

#### Response - Success (200 OK)

```json
{
  "status": "success",
  "message": "This product is authentic and registered with Syngenta.",
  "product": {
    "name": "Product Name",
    "manufacturer": "Syngenta",
    "marketedBy": "Syngenta Distribution",
    "manufacturedOn": "2025-01-15",
    "expiryDate": "2026-01-15",
    "batchNumber": "BATCH-123",
    "serialNumber": "SN-555-XYZ",
    "rawMaterialBatchNumber": "RAW-888",
    "trackingId": "TRACKING-ID-123"
  },
  "scanCountLastYear": 5,
  "uniqueRetailersLastYear": 3
}
```

#### Response - Error (400/404)

```json
{
  "status": "error",
  "message": "Invalid Tracking ID.",
  "errorCode": 6
}
```

#### Response - Warning (Counterfeit Suspected) (200 OK)

```json
{
  "status": "warning",
  "message": "Potential counterfeit detected. Please escalate.",
  "scanCountLastYear": 50,
  "uniqueRetailersLastYear": 15,
  "errorCode": 1
}
```

#### Response Schema

```typescript
interface VerificationResponse {
  status: 'success' | 'error' | 'warning';
  message: string;
  product?: {
    name?: string;
    manufacturer?: string;
    marketedBy?: string;
    manufacturedOn?: string; // ISO date: YYYY-MM-DD
    expiryDate?: string; // ISO date: YYYY-MM-DD
    batchNumber?: string;
    serialNumber?: string;
    rawMaterialBatchNumber?: string;
    trackingId?: string;
  };
  errorCode?: number; // Error code 0-12 (see below)
  scanCountLastYear?: number; // Total scans in last 12 months
  uniqueRetailersLastYear?: number; // Unique retailers who scanned
}
```

## Error Codes

The backend should return appropriate error codes for different failure scenarios:

| Code | Message                                       | When to Use                      |
| ---- | --------------------------------------------- | -------------------------------- |
| 0    | Tracking id is not available                  | Tracking ID not found in system  |
| 1    | Code scanned multiple times. Contact Syngenta | Suspicious scan pattern detected |
| 2    | Tracking id is not available                  | Duplicate of code 0              |
| 3    | Tracking ID is not active                     | Product not yet activated        |
| 4    | Invalid mandatory input values                | Request validation failed        |
| 5    | Missing mandatory input values                | Required fields missing          |
| 6    | Invalid Tracking ID                           | Malformed tracking ID            |
| 7    | Tracking ID is blacklisted                    | Product flagged as blacklisted   |
| 8    | Authentication for code has failed            | Auth token invalid/expired       |
| 9    | Turkey product with valid format              | Special case for Turkey region   |
| 10   | GTIN does not exist                           | GTIN not in database             |
| 11   | SN does not exist                             | Serial number not found          |
| 12   | Tracking ID is stolen                         | Product reported as stolen       |

## HTTP Status Codes

| Status                    | When to Use                                          |
| ------------------------- | ---------------------------------------------------- |
| 200 OK                    | Successful verification (status: success or warning) |
| 400 Bad Request           | Invalid request format (errorCode 4, 5, 6)           |
| 401 Unauthorized          | Invalid auth token (errorCode 8)                     |
| 404 Not Found             | Tracking ID not found (errorCode 0, 2, 10, 11)       |
| 429 Too Many Requests     | Rate limit exceeded                                  |
| 500 Internal Server Error | Server error                                         |
| 503 Service Unavailable   | Maintenance mode                                     |

## Client Behavior

### Retry Logic

The SDK will automatically retry failed requests with exponential backoff:

- **5xx errors**: Retry up to `retryAttempts` times (default: 3)
- **Network errors**: Retry up to `retryAttempts` times
- **4xx errors**: No retry (client error)
- **Backoff**: 1s, 2s, 4s, 8s...

### Timeout

- Default timeout: 30 seconds
- Configurable via `timeout` parameter
- Request aborted if timeout exceeded

### Authentication

- If `authToken` provided, sent as `Authorization: Bearer <token>`
- Backend should validate token and return 401 if invalid
- SDK will not retry 401 errors

## Example Implementations

### Successful Verification

**Request:**

```bash
POST /api/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "code": "SYN-PROD-12345",
  "codeType": "QR",
  "retailerId": "RETAILER-001"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "This product is authentic and registered with Syngenta.",
  "product": {
    "name": "Atrazina 500 SC",
    "manufacturer": "Syngenta Crop Protection AG",
    "marketedBy": "Syngenta",
    "manufacturedOn": "2025-01-15",
    "expiryDate": "2027-01-15",
    "batchNumber": "BATCH-2025-001",
    "serialNumber": "SN-12345-ABCD",
    "rawMaterialBatchNumber": "RM-2024-500",
    "trackingId": "TRACK-12345"
  },
  "scanCountLastYear": 2,
  "uniqueRetailersLastYear": 1
}
```

### Error - Invalid Tracking ID

**Request:**

```bash
POST /api/verify
Content-Type: application/json

{
  "code": "INVALID-CODE-999"
}
```

**Response (404 Not Found):**

```json
{
  "status": "error",
  "message": "Invalid Tracking ID.",
  "errorCode": 6
}
```

### Warning - Counterfeit Suspected

**Request:**

```bash
POST /api/verify
Content-Type: application/json

{
  "code": "SYN-SUSPICIOUS-CODE",
  "retailerId": "RETAILER-015"
}
```

**Response (200 OK):**

```json
{
  "status": "warning",
  "message": "This product has been scanned by multiple retailers. Please verify authenticity.",
  "scanCountLastYear": 48,
  "uniqueRetailersLastYear": 15,
  "errorCode": 1
}
```

## Optional Fields

### Product Fields

All product fields are optional. The SDK will display "N/A" for missing fields:

- `name` - Product name
- `manufacturer` - Manufacturing company
- `marketedBy` - Marketing company
- `manufacturedOn` - Production date (ISO format)
- `expiryDate` - Expiration date (ISO format)
- `batchNumber` - Batch/lot number
- `serialNumber` - Serial number
- `rawMaterialBatchNumber` - Raw material batch
- `trackingId` - Tracking identifier

### Counterfeit Detection Fields

Optional fields for counterfeit detection:

- `scanCountLastYear` - Total scans in last 365 days
- `uniqueRetailersLastYear` - Number of unique retailers who scanned

If `uniqueRetailersLastYear` > threshold (default: 10), the SDK displays a warning.

## Security Considerations

### Authentication

- Use JWT tokens for authentication
- Implement token refresh mechanism
- Return 401 for expired/invalid tokens

### Rate Limiting

- Implement rate limiting per user/IP
- Return 429 Too Many Requests with `Retry-After` header
- Recommended: 100 requests per minute per user

### Input Validation

- Validate `code` format (length, characters)
- Validate `codeType` is one of allowed values
- Sanitize inputs to prevent injection attacks

### HTTPS Only

- **Always use HTTPS** for secure communication
- Reject HTTP requests
- Use TLS 1.2 or higher

## Testing

### Test Codes

Provide test codes for development:

```typescript
// Valid test code
const VALID_TEST_CODE = 'SYN-TEST-VALID-123';

// Invalid test code (error code 6)
const INVALID_TEST_CODE = 'SYN-TEST-INVALID-999';

// Counterfeit warning test code
const COUNTERFEIT_TEST_CODE = 'SYN-TEST-COUNTERFEIT-456';
```

### Mock Responses

For development/testing, support a mock mode:

```typescript
// Development config
const client = new BackendClient({
  baseUrl: 'https://api-dev.syngenta.com',
  authToken: 'dev-token',
});
```

## Monitoring & Logging

### Backend Metrics to Track

- Request count by endpoint
- Response times (p50, p95, p99)
- Error rates by error code
- Authentication failures
- Rate limit hits

### Logs to Record

- Request: code, codeType, retailerId, timestamp
- Response: status, errorCode, scanCount
- Authentication: userId, token validity
- Performance: processing time

## Support

For questions about the API contract:

- Check [packages/README.md](../packages/README.md)
- Review [ARCHITECTURE_DESIGN.md](./ARCHITECTURE_DESIGN.md)
- Contact: api-support@syngenta.com

## Changelog

### Version 1.0.0 (2025-11-15)

- Initial API contract specification
- Error codes 0-12 defined
- Counterfeit detection support
- JWT authentication support
