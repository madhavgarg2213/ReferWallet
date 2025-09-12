# Shop Management System

A full-stack web application for managing customers with unique ReferIDs, purchase tracking, and automatic wallet balance management.

---

## Features

- **Customer Management**: Add, view, and delete customers with auto-generated ReferIDs.
- **Purchase Entry**: Record purchases and automatically credit customer wallets.
- **Wallet System**: 2% of each purchase amount is credited to customer wallets. Wallet balance can be used for purchases.
- **Purchase History**: View complete transaction history, clear all purchases.
- **Dashboard**: Overview of customers, purchases, and wallet balances. Quick search by ReferID or name.
- **Password Protection**: Access to the app is protected by a password gate.
- **WhatsApp Integration**: Send welcome and wallet balance messages to customers via WhatsApp.
- **Responsive UI**: Built with Tailwind CSS for a modern, mobile-friendly interface.

---

## ReferID Format

ReferIDs are automatically generated in the format: `SSABXYZ`
- `SS`: Constant prefix
- `A`: First letter of first name
- `B`: First letter of last name  
- `XYZ`: Last 3 digits of contact number

Example: For "John Doe" with contact "1234567890" → ReferID: `SSJD890`

---

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- RESTful API design
- dotenv for environment variables

### Frontend
- React.js (Create React App)
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

---

## Project Structure

```
shop/
├── backend/
│   ├── models/
│   │   ├── Customer.js
│   │   └── Purchase.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── customers.js
│   │   └── purchases.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── CustomerManagement.js
│   │   │   ├── PurchaseEntry.js
│   │   │   ├── PurchaseHistory.js
│   │   │   └── Withdraw.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── start.sh
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn
- [brew](https://brew.sh/) (for Mac users, to auto-start MongoDB)

---

### Backend Setup

1. Navigate to backend directory:
    ```bash
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file:
    ```env
    MONGODB_URI=mongodb://localhost:27017/shop-management
    PORT=5001
    SITE_PASSWORD=yourpassword
    ```

4. Start MongoDB service (if running locally):
    - On Mac: `brew services start mongodb-community`
    - Or start manually as per your OS.

5. Start the backend server:
    ```bash
    npm run dev
    ```
    The backend will run on [http://localhost:5001](http://localhost:5001)

---

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
    The frontend will run on [http://localhost:3000](http://localhost:3000)

---

### One-Click Start (Recommended)

You can use the provided script to start everything (MongoDB, backend, frontend):

```bash
./start.sh
```

---

## API Endpoints

### Customers
- `GET /api/customers` — Get all customers
- `GET /api/customers/refer/:referId` — Get customer by ReferID
- `POST /api/customers` — Create new customer
- `PATCH /api/customers/:id/wallet` — Update customer wallet
- `DELETE /api/customers/:id` — Delete customer

### Purchases
- `GET /api/purchases` — Get all purchases
- `POST /api/purchases` — Create new purchase (handles wallet deduction and credit)
- `GET /api/purchases/customer/:referId` — Get purchases by customer
- `DELETE /api/purchases/clear/all` — Delete all purchases

### Auth
- `POST /api/auth/check` — Check site password

---

## Usage

1. **Login**: Enter the site password to access the app.
2. **Add Customers**: Go to Customers page and add new customers. ReferIDs are auto-generated.
3. **Record Purchases**: Go to New Purchase, enter ReferID, amount, and submit. Wallet is credited automatically.
4. **Withdraw/Purchase**: Use the Withdraw page to use wallet balance for purchases.
5. **View History**: Check Purchase History for all transactions and wallet credits.
6. **Dashboard**: See an overview and search for purchases by ReferID or name.
7. **WhatsApp**: Send welcome or wallet balance messages to customers directly from the app.

---

## Features in Detail

### Customer Management
- Add customers with full name and contact number
- Automatic ReferID generation
- View, search, and delete customers
- Real-time wallet balance updates
- Send welcome message via WhatsApp

### Purchase System
- Lookup customers by ReferID before recording purchase
- Automatic 2% wallet credit calculation
- Real-time wallet balance updates
- Use wallet balance for purchases (Withdraw)
- Purchase validation and error handling

### Wallet System
- 2% of every purchase amount is credited to customer wallet
- Wallet balance can be used for purchases
- Real-time balance tracking
- Transaction history for each customer
- WhatsApp notification for high wallet balance

### Security
- Password gate for app access (password set in backend `.env` as `SITE_PASSWORD`)

---

## Development

### Backend
- Express.js RESTful API
- MongoDB with Mongoose for data modeling
- CORS enabled for frontend communication
- Error handling middleware

### Frontend
- React functional components with hooks
- Tailwind CSS for responsive design
- Axios for API communication
- React Router for navigation

---

## Production Deployment

1. Build the frontend:
    ```bash
    cd frontend
    npm run build
    ```
2. Set production environment variables in backend.
3. Deploy backend to your preferred hosting service.
4. Serve frontend build files through a web server.

---

## License

This project is licensed under the ISC License.

---

## Author

Made by - Madhav Garg
