# SpendWise API Documentation

## Base URL
```
http://localhost:8080
```

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Wallets](#wallets)
- [Categories](#categories)
- [Transactions](#transactions)
- [Summary](#summary)
- [Error Handling](#error-handling)

---

## Authentication

Untuk endpoint yang memerlukan autentikasi, sertakan JWT token dalam header:
```
Authorization: Bearer <your_token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

---

## Users

### 1. Register User

Membuat akun pengguna baru.

**Endpoint:** `POST /users/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Validasi:**
- `email`: Valid email format (required)
- `name`: String minimal 1 karakter (required)
- `password`: String minimal 8 karakter (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-22T10:00:00.000Z",
    "updatedAt": "2025-12-22T10:00:00.000Z"
  }
}
```

---

### 2. Login User

Login untuk mendapatkan JWT token.

**Endpoint:** `POST /users/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validasi:**
- `email`: Valid email format (required)
- `password`: String minimal 8 karakter (required)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

---

## Wallets

### 1. List All Wallets

Menampilkan semua dompet pengguna.

**Endpoint:** `GET /wallets`

**Authentication:** Not required (tapi sebaiknya ditambahkan)

**Query Parameters:**
- `type` (optional): Filter berdasarkan tipe wallet
  - Values: `cash`, `bank`, `e_wallet`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Wallets fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Main Wallet",
      "type": "cash",
      "balance": "100000.00",
      "currency": "IDR",
      "userId": 1,
      "deletedAt": null
    },
    {
      "id": 2,
      "name": "Bank Account",
      "type": "bank",
      "balance": "5000000.00",
      "currency": "IDR",
      "userId": 1,
      "deletedAt": null
    }
  ]
}
```

---

### 2. Create Wallet

Membuat dompet baru.

**Endpoint:** `POST /wallets`

**Authentication:** Not required (tapi sebaiknya ditambahkan)

**Request Body:**
```json
{
  "name": "Main Wallet",
  "type": "cash",
  "currency": "IDR"
}
```

**Validasi:**
- `name`: String minimal 1 karakter (required)
- `type`: Enum [`cash`, `bank`, `e_wallet`] (required)
- `currency`: String minimal 1 karakter (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Wallet created successfully",
  "data": {
    "id": 1,
    "name": "Main Wallet",
    "type": "cash",
    "balance": "0.00",
    "currency": "IDR",
    "userId": 1,
    "deletedAt": null
  }
}
```

---

### 3. Update Wallet

Mengupdate informasi dompet.

**Endpoint:** `PUT /wallets/:id`

**Authentication:** Not required (tapi sebaiknya ditambahkan)

**URL Parameters:**
- `id`: Wallet ID (number)

**Request Body:**
```json
{
  "name": "Updated Wallet Name",
  "balance": 150000.50,
  "currency": "IDR"
}
```

**Validasi:**
- `name`: String minimal 1 karakter (optional)
- `balance`: Number (optional)
- `currency`: String minimal 1 karakter (optional)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Wallet updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Wallet Name",
    "type": "cash",
    "balance": "150000.50",
    "currency": "IDR",
    "userId": 1,
    "deletedAt": null
  }
}
```

---

### 4. Delete Wallet

Menghapus dompet (soft delete).

**Endpoint:** `DELETE /wallets/:id`

**Authentication:** Not required (tapi sebaiknya ditambahkan)

**URL Parameters:**
- `id`: Wallet ID (number)

**Success Response (204):**
```json
{
  "success": true,
  "message": "Wallet deleted successfully",
  "data": null
}
```

---

## Categories

### 1. List All Categories

Menampilkan semua kategori.

**Endpoint:** `GET /categories`

**Authentication:** Not required

**Query Parameters:**
- `type` (optional): Filter berdasarkan tipe kategori
  - Values: `income`, `expense`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Salary",
      "icon": "💰",
      "color": "#4CAF50",
      "type": "income",
      "userId": 1,
      "deletedAt": null
    },
    {
      "id": 2,
      "name": "Food",
      "icon": "🍔",
      "color": "#FF5722",
      "type": "expense",
      "userId": 1,
      "deletedAt": null
    }
  ]
}
```

---

### 2. Get Category by ID

Menampilkan detail kategori berdasarkan ID.

**Endpoint:** `GET /categories/:id`

**Authentication:** Not required

**URL Parameters:**
- `id`: Category ID (number)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category fetched successfully",
  "data": {
    "id": 1,
    "name": "Salary",
    "icon": "💰",
    "color": "#4CAF50",
    "type": "income",
    "userId": 1,
    "deletedAt": null
  }
}
```

---

### 3. Create Category

Membuat kategori baru.

**Endpoint:** `POST /categories`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "Freelance",
  "icon": "💼",
  "color": "#2196F3",
  "type": "income"
}
```

**Validasi:**
- `name`: String minimal 1 karakter (required)
- `icon`: String minimal 1 karakter (required)
- `color`: String minimal 1 karakter (required)
- `type`: Enum [`income`, `expense`] (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 3,
    "name": "Freelance",
    "icon": "💼",
    "color": "#2196F3",
    "type": "income",
    "userId": 1,
    "deletedAt": null
  }
}
```

---

## Transactions

**Note:** Semua endpoint transactions memerlukan autentikasi.

### 1. List All Transactions

Menampilkan semua transaksi pengguna dengan filter opsional.

**Endpoint:** `GET /transactions`

**Authentication:** Required ✅

**Headers:**
```
Authorization: Bearer <your_token>
```

**Query Parameters:**
- `startDate` (optional): Filter transaksi dari tanggal tertentu (format: YYYY-MM-DD)
- `endDate` (optional): Filter transaksi sampai tanggal tertentu (format: YYYY-MM-DD)
- `categoryId` (optional): Filter berdasarkan kategori

**Example Request:**
```
GET /transactions?startDate=2025-01-01&endDate=2025-12-31&categoryId=2
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transactions fetched successfully",
  "data": [
    {
      "id": 1,
      "walletId": 1,
      "categoryId": 2,
      "type": "expense",
      "amount": "50000.00",
      "description": "Lunch at restaurant",
      "date": "2025-12-22T12:00:00.000Z",
      "receiptImage": null,
      "createdAt": "2025-12-22T12:00:00.000Z",
      "userId": 1,
      "deletedAt": null,
      "wallet": {
        "id": 1,
        "name": "Main Wallet"
      },
      "category": {
        "id": 2,
        "name": "Food",
        "icon": "🍔",
        "color": "#FF5722"
      }
    }
  ]
}
```

---

### 2. Create Transaction

Membuat transaksi baru.

**Endpoint:** `POST /transactions`

**Authentication:** Required ✅

**Headers:**
```
Authorization: Bearer <your_token>
```

**Request Body:**
```json
{
  "walletId": 1,
  "categoryId": 2,
  "type": "expense",
  "amount": 50000,
  "description": "Lunch at restaurant",
  "date": "2025-12-22"
}
```

**Validasi:**
- `walletId`: Number (required)
- `categoryId`: Number (required)
- `type`: Enum [`income`, `expense`] (required)
- `amount`: Number (required)
- `description`: String minimal 1 karakter (required)
- `date`: String minimal 1 karakter (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "walletId": 1,
    "categoryId": 2,
    "type": "expense",
    "amount": "50000.00",
    "description": "Lunch at restaurant",
    "date": "2025-12-22T00:00:00.000Z",
    "receiptImage": null,
    "createdAt": "2025-12-22T12:00:00.000Z",
    "userId": 1,
    "deletedAt": null
  }
}
```

---

### 3. Update Transaction

Mengupdate transaksi yang sudah ada.

**Endpoint:** `PUT /transactions/:id`

**Authentication:** Required ✅

**Headers:**
```
Authorization: Bearer <your_token>
```

**URL Parameters:**
- `id`: Transaction ID (number)

**Request Body:**
```json
{
  "amount": 75000,
  "description": "Updated description"
}
```

**Validasi:**
- `amount`: Number (optional)
- `description`: String minimal 1 karakter (optional)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "id": 1,
    "walletId": 1,
    "categoryId": 2,
    "type": "expense",
    "amount": "75000.00",
    "description": "Updated description",
    "date": "2025-12-22T00:00:00.000Z",
    "receiptImage": null,
    "createdAt": "2025-12-22T12:00:00.000Z",
    "userId": 1,
    "deletedAt": null
  }
}
```

---

### 4. Delete Transaction

Menghapus transaksi.

**Endpoint:** `DELETE /transactions/:id`

**Authentication:** Required ✅

**Headers:**
```
Authorization: Bearer <your_token>
```

**URL Parameters:**
- `id`: Transaction ID (number)

**Success Response (204):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "data": null
}
```

---

## Summary

### Get Financial Summary

Mendapatkan ringkasan keuangan pengguna.

**Endpoint:** `GET /summary`

**Authentication:** Required ✅

**Headers:**
```
Authorization: Bearer <your_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Summary fetched successfully",
  "data": {
    "totalIncome": "5000000.00",
    "totalExpense": "3500000.00",
    "totalBalance": "1500000.00",
    "wallets": [
      {
        "id": 1,
        "name": "Main Wallet",
        "balance": "500000.00"
      },
      {
        "id": 2,
        "name": "Bank Account",
        "balance": "1000000.00"
      }
    ],
    "recentTransactions": [
      {
        "id": 1,
        "type": "expense",
        "amount": "50000.00",
        "description": "Lunch",
        "date": "2025-12-22T12:00:00.000Z",
        "category": {
          "name": "Food",
          "icon": "🍔"
        }
      }
    ]
  }
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - OK: Request berhasil
- `201` - Created: Resource berhasil dibuat
- `204` - No Content: Request berhasil tanpa response body
- `400` - Bad Request: Validasi error atau request tidak valid
- `401` - Unauthorized: Token tidak valid atau tidak ada
- `404` - Not Found: Resource tidak ditemukan
- `500` - Internal Server Error: Server error

### Common Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "issues": [
      {
        "path": ["email"],
        "message": "Invalid email format"
      }
    ]
  }
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Invalid or missing token"
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "message": "Cannot GET /invalid-endpoint",
  "error": "Route not found"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Data Types Reference

### Wallet Types
- `cash`: Uang tunai
- `bank`: Rekening bank
- `e_wallet`: Dompet digital (GoPay, OVO, dll)

### Transaction/Category Types
- `income`: Pemasukan
- `expense`: Pengeluaran

### Currency
Gunakan kode mata uang standar (ISO 4217):
- `IDR`: Indonesian Rupiah
- `USD`: US Dollar
- dll.

---

## Best Practices

1. **Selalu simpan JWT token setelah login** dan gunakan di header Authorization
2. **Format tanggal** menggunakan ISO 8601 (YYYY-MM-DD atau YYYY-MM-DDTHH:mm:ss.sssZ)
3. **Decimal values** dikirim sebagai number, dikembalikan sebagai string untuk precision
4. **Error handling**: Selalu cek response.success untuk mengetahui status request
5. **Soft delete**: Data yang dihapus tidak benar-benar dihapus, hanya diberi flag deletedAt

---

## Example Usage (JavaScript/TypeScript)

### Login and Store Token
```javascript
const loginResponse = await fetch('http://localhost:8080/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// Store token in localStorage or state management
localStorage.setItem('authToken', token);
```

### Make Authenticated Request
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:8080/transactions', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});

const data = await response.json();
console.log(data);
```

### Create Transaction
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:8080/transactions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    walletId: 1,
    categoryId: 2,
    type: 'expense',
    amount: 50000,
    description: 'Lunch',
    date: '2025-12-22'
  })
});

const data = await response.json();
console.log(data);
```

---

## Contact & Support

Untuk pertanyaan atau issue, silakan hubungi tim backend atau buat issue di repository.

**Last Updated:** December 22, 2025
