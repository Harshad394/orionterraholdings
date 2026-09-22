# Orion Terra — Public API Documentation

This document outlines the public REST API endpoints available in the Orion Terra MVP application.

---

## 1. Properties API

### `GET /api/properties`

Fetch published land opportunities with search, filtering, and pagination support.

#### Query Parameters
- `page` (optional, default: `1`): Page number.
- `limit` (optional, default: `12`, max: `50`): Number of items per page.
- `search` (optional): Case-insensitive search across title, property ID (`OT-MH-001`), city, state, address.
- `city` (optional): Filter by exact city (e.g. `Thane`, `Navi Mumbai`).
- `state` (optional): Filter by state.
- `propertyType` (optional): Filter by type (`Residential`, `Commercial`, `Industrial`, `Agricultural`, `Mixed Use`, `Other`).
- `opportunityType` (optional): Filter by opportunity model (`Direct Sale`, `Redevelopment`, `Joint Venture`, `Long-term Development`, `Investment`, `Other`).
- `featured` (optional, `true`/`false`): Filter featured properties.

#### Response Example (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "65d3a1b2c4e5f67890123456",
      "propertyId": "OT-MH-001",
      "slug": "prime-redevelopment-land-thane",
      "title": "Prime Redevelopment Land Opportunity",
      "description": "Strategically located prime land plot...",
      "location": {
        "address": "Ghodbunder Road Sector 4",
        "city": "Thane",
        "state": "Maharashtra",
        "country": "India"
      },
      "landArea": 25000,
      "landAreaUnit": "sq.ft",
      "propertyType": "Residential",
      "opportunityType": "Redevelopment",
      "price": null,
      "priceVisibility": "CONTACT",
      "images": ["https://images.unsplash.com/..."],
      "featured": true,
      "status": "PUBLISHED",
      "createdAt": "2026-02-10T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### `GET /api/properties/[slug]`

Fetch single published property details by slug.

#### Response Example (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "65d3a1b2c4e5f67890123456",
    "propertyId": "OT-MH-001",
    "slug": "prime-redevelopment-land-thane",
    "title": "Prime Redevelopment Land Opportunity",
    "description": "...",
    "status": "PUBLISHED"
  }
}
```

#### Error Response (`404 Not Found`)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Property opportunity not found or is not currently active"
  }
}
```

---

## 2. Seller Submission API

### `POST /api/seller-submissions`

Submit land property details for admin review. The server automatically forces `status: "PENDING"`.

#### Request Body (`application/json`)
```json
{
  "sellerName": "Rajesh Patil",
  "phone": "+91 98765 43210",
  "email": "rajesh@example.com",
  "company": "Patil Family Trust",
  "propertyLocation": "Plot 45, Highway Sector 2",
  "city": "Thane",
  "state": "Maharashtra",
  "landArea": 25000,
  "landAreaUnit": "sq.ft",
  "propertyType": "Residential",
  "opportunityType": "Redevelopment",
  "expectedPrice": 450000000,
  "description": "Prime land plot for residential redevelopment.",
  "documentsAvailable": "Yes",
  "consent": true
}
```

#### Response Example (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "65d3b2c3d4e5f67890123457",
    "sellerName": "Rajesh Patil",
    "propertyLocation": "Plot 45, Highway Sector 2",
    "city": "Thane",
    "status": "PENDING",
    "createdAt": "2026-09-17T11:45:00.000Z"
  },
  "message": "Your property details have been submitted successfully. Our team will review the information and contact you."
}
```

---

## 3. Buyer Inquiry API

### `POST /api/inquiries`

Submit a buyer inquiry for a published property. The server verifies property existence and forces `status: "NEW"`.

#### Request Body (`application/json`)
```json
{
  "propertyId": "65d3a1b2c4e5f67890123456",
  "name": "Vikram Sharma",
  "phone": "+91 98111 22334",
  "email": "vikram@example.com",
  "message": "Interested in property OT-MH-001. Please arrange a discussion."
}
```

---

## 4. Protected Admin API

All `/api/admin/*` endpoints require the admin session cookie created by `POST /api/admin/login`.

### Properties

- `GET /api/admin/properties`: List properties with `search`, `status`, `city`, `propertyType`, `opportunityType`, `page`, and `limit`.
- `POST /api/admin/properties`: Create a property. Server validates all fields, generates a unique slug, rejects duplicate `propertyId`, and prevents duplicate seller-submission conversion.
- `GET /api/admin/properties/[id]`: Fetch one property for admin editing.
- `PATCH /api/admin/properties/[id]`: Update whitelisted property fields and ordered image metadata.
- `DELETE /api/admin/properties/[id]`: Delete a property and delete stored Cloudinary assets when public IDs are available.
- `PATCH /api/admin/properties/[id]/status`: Set `DRAFT`, `PUBLISHED`, or `UNPUBLISHED`.
- `PATCH /api/admin/properties/[id]/featured`: Set featured state.
- `POST /api/admin/properties/[id]/images`: Upload and attach images to a property.
- `DELETE /api/admin/properties/[id]/images`: Remove one image from a property and delete its Cloudinary asset when possible.
- `POST /api/admin/images`: Upload image files for the create/edit workflow.
- `DELETE /api/admin/images`: Delete a Cloudinary image by stored public ID.

### Seller Submissions

- `GET /api/admin/submissions`: List seller submissions with `search`, `status`, `city`, `state`, `propertyType`, `opportunityType`, `page`, and `limit`.
- `GET /api/admin/submissions/[id]`: Fetch complete private submission details.
- `PATCH /api/admin/submissions/[id]/status`: Set `PENDING`, `APPROVED`, `REJECTED`, or `MORE_INFORMATION_REQUIRED`.

#### Response Example (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "65d3c3d4e5f67890123458",
    "propertyId": "OT-MH-001",
    "propertyTitle": "Prime Redevelopment Land Opportunity",
    "name": "Vikram Sharma",
    "status": "NEW",
    "createdAt": "2026-09-17T11:45:00.000Z"
  },
  "message": "Thank you. Our team will contact you regarding this opportunity."
}
```
