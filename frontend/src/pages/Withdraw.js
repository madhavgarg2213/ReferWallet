import React, { useState } from 'react';
import { customerAPI, purchaseAPI } from '../services/api';

const Withdraw = () => {
  const [referId, setReferId] = useState('');
  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lookup customer by ReferID
  const handleLookup = async () => {
    setError('');
    setSuccess('');
    setCustomer(null);
    if (!referId.trim()) {
      setError('Please enter a ReferID');
      return;
    }
    try {
      setLoading(true);
      const res = await customerAPI.getByReferId(referId.trim().toUpperCase());
      setCustomer(res.data);
    } catch (err) {
      setError('Customer not found');
    } finally {
      setLoading(false);
    }
  };

  // Calculate wallet usage
  const purchaseAmount = parseFloat(amount) || 0;
  const walletUsed = customer ? Math.min(purchaseAmount, customer.walletBalance) : 0;
  const toPay = purchaseAmount - walletUsed;

  // Handle Withdraw (Purchase)
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!customer) {
      setError('Please lookup a customer first.');
      return;
    }
    if (!purchaseAmount || purchaseAmount <= 0) {
      setError('Enter a valid purchase amount.');
      return;
    }
    try {
      setLoading(true);
      // Record purchase with wallet deduction
      await purchaseAPI.create({
        referId: customer.referId,
        amount: purchaseAmount,
        walletUsed
      });
      setSuccess(
        `Withdrawal successful! ₹${walletUsed.toFixed(2)} used from wallet. Customer pays ₹${toPay.toFixed(2)}.`
      );
      setCustomer({
        ...customer,
        walletBalance: customer.walletBalance - walletUsed
      });
      setAmount('');
    } catch (err) {
      setError('Failed to process withdrawal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Withdraw / Purchase</h1>
        <p className="mt-2 text-gray-600">Use customer wallet balance for a purchase</p>
      </div>
      <div className="max-w-xl">
        <form onSubmit={handleWithdraw} className="space-y-6 bg-white shadow px-4 py-5 sm:p-6 sm:rounded-lg">
          {/* ReferID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer ReferID</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={referId}
                onChange={e => setReferId(e.target.value)}
                placeholder="SSABXYZ"
                className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={handleLookup}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 disabled:opacity-50"
              >
                {loading ? 'Looking up...' : 'Lookup'}
              </button>
            </div>
          </div>

          {/* Customer Info */}
          {customer && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Customer Found</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p><strong>Name:</strong> {customer.name}</p>
                    <p><strong>Contact:</strong> {customer.contactNumber}</p>
                    <p><strong>Wallet Balance:</strong> ₹{customer.walletBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Amount Input */}
          {customer && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          )}

          {/* Calculation Preview */}
          {customer && amount && purchaseAmount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-sm text-blue-700">
                <p>Wallet Used: <strong>₹{walletUsed.toFixed(2)}</strong></p>
                <p>Amount to Pay: <strong>₹{toPay.toFixed(2)}</strong></p>
                <p>Wallet Balance After: <strong>₹{(customer.walletBalance - walletUsed).toFixed(2)}</strong></p>
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Submit */}
          {customer && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !amount || purchaseAmount <= 0}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Withdraw & Purchase'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Withdraw;