# Address Management API

This is a Node.js and Express-based API for managing user and address data. It provides endpoints to validate and store user information in a PostgreSQL database using Prisma ORM.

## Features

- **User and Address Validation**: Validates user and address data using [Zod](https://zod.dev/).
- **Data Storage**: Stores user and address data in a PostgreSQL database.
- **RESTful Endpoints**: Simple and intuitive REST API endpoints.
- **Error Handling**: Handles validation and database errors gracefully.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for creating the API.
- **Prisma ORM**: For database management and schema synchronization.
- **Zod**: Validation library for schema-based validation.
- **PostgreSQL**: Relational database to store user and address data.

## Prerequisites

- **Node.js** v14 or higher
- **PostgreSQL** database
- **Prisma Client** setup

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Atul-Shivnani/address.git
cd address
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start the Server

```bash
npm start
The server will start on http://localhost:3001.
```

# API Endpoints

## POST /submission

- **Description**: Adds a new user and their address to the database. If the user already exists, adds a new address for that user.

- **Request Body**: 
```json
{
  "userData": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890"
  },

  "addressData": {
    "address1": "123 Main St",
    "address2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  }
}
```

- **Response**:
- 200 OK: If the user and address are added successfully.
- 400 Bad Request: If validation fails.
- 500 Internal Server Error: If a server or database error occurs.

## Error Handling

- **All errors are returned with a JSON response in the following format**:

```json
{
  "state": "error",
  "msg": "Description of the error"
}
```
