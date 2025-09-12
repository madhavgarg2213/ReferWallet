import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // NEW: 1. State for the WhatsApp modal and the newly added customer
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [newlyAddedCustomer, setNewlyAddedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.contactNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await customerAPI.create(formData);
      const newCustomer = response.data; // The full customer object from the backend

      setCustomers(prev => [newCustomer, ...prev]);
      setFormData({ name: '', contactNumber: '' });
      setShowAddForm(false);
      setSuccess('Customer added successfully!');

      // NEW: 2. Set the new customer's data and show the WhatsApp modal
      setNewlyAddedCustomer(newCustomer);
      setShowWhatsAppModal(true);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add customer');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.referId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactNumber.includes(searchTerm)
  );

  // NEW: 3. Function to generate the WhatsApp link and message
  const generateWhatsAppLink = () => {
    if (!newlyAddedCustomer) return '';

    // Sanitize phone number: ensure it's in international format (e.g., with country code 91 for India)
    let phoneNumber = newlyAddedCustomer.contactNumber.replace(/\D/g, ''); // Remove non-digits
    if (phoneNumber.length === 10) {
      phoneNumber = `91${phoneNumber}`; // Prepend country code if it's a 10-digit number
    }

    const message = `Hey ${newlyAddedCustomer.name}! Great news - you've unlocked your exclusive Sona Sarees wallet! 🛍️ Start saving on future purchases today. Want to earn even more? Share your personal refer code ${newlyAddedCustomer.referId} with friends and get a bonus when they shop!`;
    
    // URL-encode the message text
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ... (The top part of your component remains the same) ... */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="mt-2 text-gray-600">Manage your customers and their wallet balances</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add New Customer
        </button>
      </div>


      {/* Add Customer Form Modal (No changes here) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Customer</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* NEW: 4. WhatsApp Message Modal */}
      {showWhatsAppModal && newlyAddedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Send Welcome Message</h3>
              <p className="text-sm text-gray-600 mb-4">
                Customer '{newlyAddedCustomer.name}' was added. Send them a welcome message on WhatsApp.
              </p>
              
              <div className="bg-gray-50 p-3 rounded-md text-left text-sm text-gray-800 mb-6">
                <p><strong>Message Preview:</strong></p>
                <p className="italic">Hey {newlyAddedCustomer.name}! Great news - you've unlocked your exclusive Sona Sarees wallet! 🛍️ Start saving on future purchases today. Want to earn even more? Share your personal refer code {newlyAddedCustomer.referId} with friends and get a bonus when they shop!</p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Skip
                </button>
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md flex items-center"
                >
                  Send on WhatsApp
                </a>
              </div>
            </div>
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

      {/* Customers Table (No changes here) */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All Customers ({filteredCustomers.length})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Complete list of customers with their ReferIDs and wallet balances
          </p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by name, ReferID, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full sm:w-1/2 md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ReferID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{customer.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{customer.referId}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.contactNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-green-600">₹{customer.walletBalance.toFixed(2)}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={async () => {
                        if (window.confirm(`Delete customer ${customer.name}?`)) {
                          try {
                            await customerAPI.delete(customer._id);
                            setCustomers(prev => prev.filter(c => c._id !== customer._id));
                          } catch (err) {
                            setError('Failed to delete customer');
                          }
                        }
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found. Add your first customer!</p>
          </div>
        )}
        {customers.length > 0 && filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customer found for search term: "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;