# API Documentation

## Base URL
```
https://finansowy-tracker-production.up.railway.app/api
```

## Authentication
All requests require `x-user-id` header:
```
x-user-id: {userId}
```

## Error Response Format
All errors follow this standard format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // Optional
  }
}
```

## Sync Endpoints

### POST /sync/push
Upload changes from client to server.

**Request:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "income|expense",
      "amount": 100.50,
      "category": "Food",
      "date": "2024-05-06T10:00:00Z",
      "description": "Lunch",
      "version": 1,
      "updatedAt": "2024-05-06T10:00:00Z"
    }
  ],
  "deviceId": "device-identifier",
  "lastSyncTime": "2024-05-06T09:00:00Z"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "uploaded": [],
    "conflicts": [],
    "errors": []
  },
  "serverTime": "2024-05-06T10:00:00Z"
}
```

### POST /sync/pull
Download changes from server to client.

**Request:**
```json
{
  "lastSyncTime": "2024-05-06T09:00:00Z",
  "deviceId": "device-identifier"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [],
    "deletedTransactions": [],
    "syncLog": []
  },
  "serverTime": "2024-05-06T10:00:00Z",
  "checksum": "hash"
}
```

### POST /sync/merge
Merge local and server changes (conflict resolution).

**Request:**
```json
{
  "localTransactions": [],
  "lastSyncTime": "2024-05-06T09:00:00Z",
  "deviceId": "device-identifier"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "results": {
      "applied": [],
      "conflicts": [],
      "errors": []
    },
    "stats": {}
  },
  "serverTime": "2024-05-06T10:00:00Z"
}
```

### GET /sync/health
Health check for sync service.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-05-06T10:00:00Z",
  "service": "sync-api",
  "version": "2.0.0"
}
```

## Analytics Endpoints

### GET /analytics/summary?period=month
Get summary statistics.

**Query Parameters:**
- `period`: week, month, quarter, year, all (default: month)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000,
    "totalExpense": 1500,
    "balance": 3500,
    "transactionCount": 25
  }
}
```

### GET /analytics/trends
Get expense trends.

**Response:**
```json
{
  "success": true,
  "data": {
    "monthlyTrends": [],
    "categoryTrends": []
  }
}
```

### GET /analytics/forecast
Predict next month expenses.

**Response:**
```json
{
  "success": true,
  "data": {
    "predictedExpenses": 1600,
    "confidence": 0.85,
    "basedOnMonths": 3
  }
}
```

### GET /analytics/recommendations
Get savings recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [],
    "savingsPotential": 500
  }
}
```

### GET /analytics/health
Health check for analytics service.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-05-06T10:00:00Z",
  "service": "analytics-api",
  "version": "2.0.0"
}
```

## Global Endpoints

### GET /health
Global health check.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-05-06T10:00:00Z",
  "service": "finansowy-tracker-backend",
  "version": "2.0.0",
  "environment": "production",
  "uptime": 3600
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_USER_ID | 401 | Missing or invalid userId header |
| INVALID_REQUEST | 400 | Request validation failed |
| VALIDATION_ERROR | 400 | Transaction data validation failed |
| VERSION_CONFLICT | 409 | Data conflict (version mismatch) |
| PROCESSING_ERROR | 400 | Error processing request |
| ANALYTICS_ERROR | 500 | Error calculating analytics |
| SERVER_ERROR | 500 | Internal server error |
| NOT_FOUND | 404 | Endpoint not found |
| INTERNAL_ERROR | 500 | Unhandled error |

## Transaction Validation Rules

| Field | Type | Rules |
|-------|------|-------|
| type | string | Required. Must be "income" or "expense" |
| amount | number | Required. Must be > 0 and <= 1,000,000 |
| category | string | Required. Max 50 characters |
| date | ISO string | Required. Cannot be in future |
| description | string | Optional. Max 500 characters |

## Testing

### Test Health Check
```bash
curl https://finansowy-tracker-production.up.railway.app/health
```

### Test with userId
```bash
curl -H "x-user-id: test-user-123" \
  https://finansowy-tracker-production.up.railway.app/api/sync/health
```
