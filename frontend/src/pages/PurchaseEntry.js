import React, { useState } from 'react';
import { purchaseAPI, customerAPI } from '../services/api';

const PurchaseEntry = () => {
  const [formData, setFormData] = useState({
    referId: '',
    amount: ''
  });
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReferIdLookup = async () => {
    setShowWalletModal(false);
    
    if (!formData.referId.trim()) {
      setError('Please enter a ReferID');
      setCustomer(null);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await customerAPI.getByReferId(formData.referId.toUpperCase());
      setCustomer(response.data);
    } catch (error) {
      setCustomer(null);
      setError('Customer not found with this ReferID');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.referId.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid ReferID and amount');
      return;
    }
    if (!customer) {
      setError('Please verify the customer by looking up the ReferID first');
      return;
    }

    try {
      setLoading(true);
      const purchaseResponse = await purchaseAPI.create({
        referId: formData.referId.toUpperCase(),
        amount: parseFloat(formData.amount)
      });
      
      const creditedAmount = purchaseResponse.data.walletCredit;
      const newBalance = customer.walletBalance + creditedAmount;

      setSuccess(`Purchase recorded! ${customer.name} received ₹${creditedAmount.toFixed(2)} credit.`);
      setFormData({ referId: '', amount: '' });

      if (newBalance >= 500) {
        setCustomer(prev => ({ ...prev, walletBalance: newBalance }));
        setShowWalletModal(true);
      } else {
        setCustomer(null);
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to record purchase');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setShowWalletModal(false);
    setCustomer(null);
  };

  const walletCredit = formData.amount ? (parseFloat(formData.amount) * 0.02).toFixed(2) : '0.00';

  let reminderWhatsappLink = '';
  let reminderMessage = '';
  if (customer) {
    reminderMessage = `Great news, ${customer.name}! Your Sona Sarees wallet balance is now ₹${customer.walletBalance.toFixed(2)}. It's the perfect time to shop! Use your balance to get ₹${customer.walletBalance.toFixed(2)} off on your next purchase. See you soon!`;
    reminderWhatsappLink = `https://wa.me/91${customer.contactNumber}?text=${encodeURIComponent(reminderMessage)}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">New Purchase Entry</h1>
        <p className="mt-2 text-gray-600">Record a new purchase and automatically credit customer wallet</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:p-6 sm:rounded-lg">
            <div className="grid grid-cols-1 gap-6">
              
              {/* ReferID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer ReferID</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input type="text" name="referId" value={formData.referId} onChange={handleInputChange} placeholder="SSABXYZ" className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                  <button type="button" onClick={handleReferIdLookup} disabled={loading} className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 disabled:opacity-50">
                    {loading ? 'Looking up...' : 'Lookup'}
                  </button>
                </div>
              </div>

              {/* Customer Info Display */}
              {customer && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Customer Found</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p><strong>Name:</strong> {customer.name}</p>
                        <p><strong>Contact:</strong> {customer.contactNumber}</p>
                        <p><strong>Current Wallet Balance:</strong> ₹{customer.walletBalance.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Amount (₹)</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="0.00" step="0.01" min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
              </div>

              {/* Wallet Credit Preview */}
              {formData.amount && parseFloat(formData.amount) > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Wallet Credit Preview</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Purchase Amount: <strong>₹{parseFloat(formData.amount).toFixed(2)}</strong></p>
                        <p>Wallet Credit (2%): <strong>₹{walletCredit}</strong></p>
                        <p>New Wallet Balance: <strong>₹{customer ? (customer.walletBalance + parseFloat(walletCredit)).toFixed(2) : walletCredit}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Display */}
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

              {/* Submit Button */}
              <div className="flex justify-end">
                <button type="submit" disabled={loading || !customer} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Processing...' : 'Record Purchase'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* High Balance WhatsApp Pop-up Modal */}
      {showWalletModal && customer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900">High Wallet Balance Alert!</h3>
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700">{reminderMessage}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click 'Send' to open WhatsApp and notify <strong>{customer.name}</strong> about their new balance.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md">
                Close
              </button>
              <a href={reminderWhatsappLink} target="_blank" rel="noopener noreferrer" onClick={handleCloseModal} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md">
                Send on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseEntry;