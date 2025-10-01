import React, { useState, useEffect } from 'react';
import { customerAPI, purchaseAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalPurchases: 0,
    totalWalletBalance: 0,
    recentPurchases: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [customersRes, purchasesRes] = await Promise.all([
        customerAPI.getAll(),
        purchaseAPI.getAll()
      ]);

      const customers = customersRes.data;
      const purchases = purchasesRes.data;

      const totalWalletBalance = customers.reduce((sum, customer) => sum + customer.walletBalance, 0);
      const recentPurchases = purchases.slice(0, 5);

      setStats({
        totalCustomers: customers.length,
        totalPurchases: purchases.length,
        totalWalletBalance,
        recentPurchases
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      let purchasesRes = await purchaseAPI.getByCustomer(searchTerm.trim());
      let purchases = purchasesRes.data;
      if (purchases.length === 0) {
        const customersRes = await customerAPI.getAll();
        const customers = customersRes.data;
        const found = customers.find(
          (c) => c.name.toLowerCase() === searchTerm.trim().toLowerCase()
        );
        if (found) {
          purchasesRes = await purchaseAPI.getByCustomer(found.referId);
          purchases = purchasesRes.data;
        }
      }
      setSearchResults(purchases);
    } catch (err) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const fetchMissingCustomers = async () => {
      const needsFetch = searchResults.some(
        (p) => typeof p.customerId === 'string'
      );
      if (!needsFetch) return;

      const customersRes = await customerAPI.getAll();
      const customers = customersRes.data;

      const updatedResults = searchResults.map((purchase) => {
        if (typeof purchase.customerId === 'object') return purchase;
        const customer = customers.find((c) => c._id === purchase.customerId);
        return {
          ...purchase,
          customerId: customer || {},
        };
      });
      setSearchResults(updatedResults);
    };

    if (searchResults.length > 0) {
      fetchMissingCustomers();
    }
    // eslint-disable-next-line
  }, [searchResults]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-4">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Overview of your Sona Saree's Recent Purchase
          </p>
        </div>
        <form 
          onSubmit={handleSearch} 
          className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto"
        >
          <input
            type="text"
            placeholder="Search by ReferID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.totalCustomers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-3 sm:px-4 py-4 sm:py-5">
          <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Recent Purchases</h3>
          <div className="mt-4 sm:mt-5">
            {stats.recentPurchases.length === 0 ? (
              <p className="text-gray-500 text-sm sm:text-base">No recent purchases</p>
            ) : (
              <div className="flow-root">
                <ul className="-my-4 sm:-my-5 divide-y divide-gray-200">
                  {stats.recentPurchases.map((purchase) => (
                    <li key={purchase._id} className="py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-medium text-sm">
                                {purchase.customerId?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {purchase.customerId?.name || 'Unknown Customer'}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              ReferID: {purchase.referId}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{purchase.amount}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            +₹{purchase.walletCredit} wallet credit
                          </p>
                          {purchase.walletUsed > 0 && (
                            <p className="text-xs sm:text-sm text-red-500">
                              -₹{purchase.walletUsed} used from wallet
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white shadow rounded-lg mt-6">
          <div className="px-3 sm:px-4 py-4 sm:py-5">
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
              Search Results
            </h3>
            <div className="mt-4 sm:mt-5">
              <ul className="-my-4 sm:-my-5 divide-y divide-gray-200">
                {searchResults.map((purchase) => (
                  <li key={purchase._id} className="py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {purchase.customerId?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {purchase.customerId?.name || 'Unknown Customer'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            ReferID: {purchase.referId}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{purchase.amount}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          +₹{purchase.walletCredit} wallet credit
                        </p>
                        {purchase.walletUsed > 0 && (
                          <p className="text-xs sm:text-sm text-red-500">
                            -₹{purchase.walletUsed} used from wallet
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-8 pb-4">
        <p className="text-xs sm:text-sm text-gray-500">Made by - Madhav Garg</p>
      </div>
    </div>
  );
};

export default Dashboard;
