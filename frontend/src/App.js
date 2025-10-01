import React, { useState, useEffect } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation */}
        <nav className="bg-blue-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Brand */}
              <h1 className="text-white text-lg sm:text-xl font-bold">SONA SAREES</h1>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
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

              {/* Mobile Hamburger */}
              <div className="md:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white hover:bg-blue-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {/* Icon */}
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {menuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-blue-500">
              <div className="space-y-1 px-2 pt-2 pb-3">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/customers"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Customers
                </Link>
                <Link
                  to="/purchase"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  New Purchase
                </Link>
                <Link
                  to="/withdraw"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Withdraw
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Purchase History
                </Link>
                <div className="px-3 py-2">
                  <LogoutButton onLogout={() => setUnlocked(false)} />
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 w-full">
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
