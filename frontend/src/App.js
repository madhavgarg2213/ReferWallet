import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerManagement from './pages/CustomerManagement';
import PurchaseEntry from './pages/PurchaseEntry';
import PurchaseHistory from './pages/PurchaseHistory';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import PasswordGate from "./pages/PasswordGate";
import LogoutButton from "./components/LogoutButton";

function App() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("siteAccess") === "true") {
      setUnlocked(true);
    }
  }, []);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-blue-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-white text-xl font-bold">SONA SAREES</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/customers"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Customers
                </Link>
                <Link
                  to="/purchase"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  New Purchase
                </Link>
                <Link
                  to="/withdraw"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Withdraw
                </Link>
                <Link
                  to="/history"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Purchase History
                </Link>
                <LogoutButton onLogout={() => setUnlocked(false)} />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/purchase" element={<PurchaseEntry />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/history" element={<PurchaseHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
