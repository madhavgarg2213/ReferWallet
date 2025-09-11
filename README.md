# Shop Management System

A full-stack web application for managing customers with unique ReferIDs, purchase tracking, and automatic wallet balance management.

## Features

- **Customer Management**: Add customers with auto-generated ReferIDs
- **Purchase Entry**: Record purchases and automatically credit customer wallets
- **Wallet System**: 2% of each purchase amount is credited to customer wallets
- **Purchase History**: View complete transaction history
- **Dashboard**: Overview of customers, purchases, and wallet balances

## ReferID Format

ReferIDs are automatically generated in the format: `SSABXYZ`
- `SS`: Constant prefix
- `A`: First letter of first name
- `B`: First letter of last name  
- `XYZ`: Last 3 digits of contact number

Example: For "John Doe" with contact "1234567890" → ReferID: "SSJD890"

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- RESTful API design

### Frontend
- React.js
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

## Project Structure

```
shop/
├── backend/
│   ├── models/
│   │   ├── Customer.js
│   │   └── Purchase.js
│   ├── routes/
│   │   ├── customers.js
│   │   └── purchases.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── CustomerManagement.js
│   │   │   ├── PurchaseEntry.js
│   │   │   └── PurchaseHistory.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
MONGODB_URI=mongodb://localhost:27017/shop-management
PORT=5000
```

4. Start MongoDB service (if running locally)

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/refer/:referId` - Get customer by ReferID
- `POST /api/customers` - Create new customer
- `PATCH /api/customers/:id/wallet` - Update customer wallet

### Purchases
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create new purchase
- `GET /api/purchases/customer/:referId` - Get purchases by customer

## Usage

1. **Add Customers**: Navigate to the Customers page and add new customers. ReferIDs are auto-generated.

2. **Record Purchases**: Go to the New Purchase page, enter a ReferID to lookup the customer, enter the purchase amount, and submit.

3. **View History**: Check the Purchase History page to see all transactions and wallet credits.

4. **Dashboard**: Get an overview of your shop's performance on the main dashboard.

## Features in Detail

### Customer Management
- Add customers with full name and contact number
- Automatic ReferID generation based on name and contact
- View all customers with their wallet balances
- Real-time wallet balance updates

### Purchase System
- Lookup customers by ReferID before recording purchase
- Automatic 2% wallet credit calculation
- Real-time wallet balance updates
- Purchase validation and error handling

### Wallet System
- 2% of every purchase amount is credited to customer wallet
- Real-time balance tracking
- Transaction history for each customer

## Development

### Backend Development
- Uses Express.js for RESTful API
- MongoDB with Mongoose for data modeling
- CORS enabled for frontend communication
- Error handling middleware

### Frontend Development
- React functional components with hooks
- Tailwind CSS for responsive design
- Axios for API communication
- React Router for navigation

## Production Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Set production environment variables in backend

3. Deploy backend to your preferred hosting service

4. Serve frontend build files through a web server

## License

This project is licensed under the ISC License.
