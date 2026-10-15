import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { myQuotesCollection } from '../../firebase';
import {
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  where,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

const ManageQuotes = () => {
  // Quotes state
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingQuote, setEditingQuote] = useState(null);

  // Add quote popup state
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: '', author: '', category: 'motivation' });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // History state (local storage)
  const [history, setHistory] = useState([]);

  // Author radio selection
  const [selectedAuthor, setSelectedAuthor] = useState('');

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('quoteAddHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quoteAddHistory', JSON.stringify(history));
  }, [history]);

  // Fetch quotes from Firestore
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        let q;
        if (statusFilter === 'all') {
          q = query(myQuotesCollection, orderBy('createdAt', 'desc'));
        } else {
          q = query(
            myQuotesCollection,
            where('status', '==', statusFilter),
            orderBy('createdAt', 'desc')
          );
        }
        const querySnapshot = await getDocs(q);
        const quotesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuotes(quotesData);
      } catch (error) {
        console.error("Error fetching quotes: ", error);
      }
    };
    fetchQuotes();
  }, [statusFilter]);

  // Filter quotes based on search and category
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = searchTerm === '' ||
      quote.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || quote.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle status change
  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      const quoteRef = doc(myQuotesCollection, quoteId);
      await updateDoc(quoteRef, { status: newStatus, updatedAt: new Date() });
      setQuotes(quotes.map(quote =>
        quote.id === quoteId ? { ...quote, status: newStatus } : quote
      ));
      showNotificationMessage('Status updated successfully!', 'success');
    } catch (error) {
      console.error("Error updating quote status: ", error);
      showNotificationMessage('Failed to update status', 'error');
    }
  };

  // Handle edit quote
  const handleEdit = (quote) => setEditingQuote(quote);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const quoteRef = doc(myQuotesCollection, editingQuote.id);
      await updateDoc(quoteRef, {
        text: editingQuote.text,
        author: editingQuote.author,
        category: editingQuote.category,
        updatedAt: new Date()
      });
      setQuotes(quotes.map(quote =>
        quote.id === editingQuote.id ? editingQuote : quote
      ));
      setEditingQuote(null);
      showNotificationMessage('Quote updated successfully!', 'success');
    } catch (error) {
      console.error("Error updating quote: ", error);
      showNotificationMessage('Failed to update quote', 'error');
    }
  };

  // Handle delete quote
  const handleDelete = async (quoteId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus quote ini?")) {
      try {
        await deleteDoc(doc(myQuotesCollection, quoteId));
        setQuotes(quotes.filter(quote => quote.id !== quoteId));
        showNotificationMessage('Quote deleted successfully!', 'success');
      } catch (error) {
        console.error("Error deleting quote: ", error);
        showNotificationMessage('Failed to delete quote', 'error');
      }
    }
  };

  // Handle add new quote
  const handleAddQuote = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const docRef = await addDoc(myQuotesCollection, {
        text: newQuote.text,
        author: newQuote.author,
        category: newQuote.category,
        status: "approved",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        views: 0,
      });

      // Add to history
      const historyEntry = {
        id: docRef.id,
        text: newQuote.text,
        author: newQuote.author,
        category: newQuote.category,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [historyEntry, ...prev].slice(0, 20)); // Keep last 20 entries

      // Refresh quotes list
      const newQuoteData = {
        id: docRef.id,
        text: newQuote.text,
        author: newQuote.author,
        category: newQuote.category,
        status: "approved"
      };
      setQuotes(prev => [newQuoteData, ...prev]);

      // Reset form and close popup
      setNewQuote({ text: '', author: '', category: 'motivation' });
      setSelectedAuthor('');
      setIsAddPopupOpen(false);
      showNotificationMessage('Quote added successfully!', 'success');
    } catch (error) {
      console.error("Error adding quote: ", error);
      showNotificationMessage('Failed to add quote', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for notifications
  const showNotificationMessage = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle author radio selection
  const handleAuthorSelect = (authorName) => {
    setSelectedAuthor(authorName);
    setNewQuote(prev => ({ ...prev, author: authorName }));
  };

  // Clear history
  const clearHistory = () => {
    if (window.confirm('Clear all quote addition history?')) {
      setHistory([]);
      localStorage.removeItem('quoteAddHistory');
      showNotificationMessage('History cleared!', 'success');
    }
  };

  // Helper for category badge styling
  const getCategoryStyle = (category) => {
    const styles = {
      motivation: 'bg-blue-100 text-blue-800',
      life: 'bg-green-100 text-green-800',
      love: 'bg-pink-100 text-pink-800',
      wisdom: 'bg-purple-100 text-purple-800',
      funny: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return styles[category] || styles.other;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      motivation: 'Motivasi',
      life: 'Reminder',
      love: 'Cinta',
      wisdom: 'Kebijaksanaan',
      funny: 'Lucu',
      other: 'Lainnya'
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Quotes</h1>
          <button
            onClick={() => setIsAddPopupOpen(true)}
            className="bg-[#355485] hover:bg-[#2a436c] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
          >
            <i className="ri-add-line text-xl"></i>
            Tambah Quote
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all ${notification.type === 'error' ? 'bg-red-100 text-red-700 border-l-4 border-red-500' : 'bg-green-100 text-green-700 border-l-4 border-green-500'
            }`}>
            <i className={`${notification.type === 'error' ? 'ri-error-warning-line' : 'ri-checkbox-circle-line'} text-xl`}></i>
            <span>{notification.message}</span>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-3.5 text-gray-400"></i>
            <input
              type="text"
              placeholder="Cari quote atau author..."
              className="w-full p-3 pl-10 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Semua Kategori</option>
            <option value="motivation">Motivasi</option>
            <option value="life">Reminder</option>
            <option value="love">Cinta</option>
            <option value="wisdom">Kebijaksanaan</option>
            <option value="funny">Lucu</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        {/* Edit Quote Modal */}
        {editingQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Edit Quote</h2>
                  <button onClick={() => setEditingQuote(null)} className="text-gray-500 hover:text-gray-700">
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4f90c6] focus:border-transparent"
                    rows={4}
                    value={editingQuote.text}
                    onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4f90c6]"
                    value={editingQuote.author}
                    onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })}
                    required
                  />
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4f90c6]"
                    value={editingQuote.category}
                    onChange={(e) => setEditingQuote({ ...editingQuote, category: e.target.value })}
                  >
                    <option value="motivation">Motivasi</option>
                    <option value="life">Reminder</option>
                    <option value="love">Cinta</option>
                    <option value="wisdom">Kebijaksanaan</option>
                    <option value="funny">Lucu</option>
                    <option value="other">Lainnya</option>
                  </select>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setEditingQuote(null)} className="px-4 py-2 border rounded-xl text-gray-700 hover:bg-gray-50">Batal</button>
                    <button type="submit" className="px-4 py-2 bg-[#355485] text-white rounded-xl hover:bg-[#2a436c]">Simpan</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Quote Popup */}
        {isAddPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Tambah Quote Baru</h2>
                  <button onClick={() => setIsAddPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
                <form onSubmit={handleAddQuote} className="space-y-4">
                  <textarea
                    placeholder="Tulis quote di sini..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4f90c6]"
                    value={newQuote.text}
                    onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                    required
                  />
                  <div>
                    <input
                      placeholder="Nama author"
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4f90c6]"
                      value={newQuote.author}
                      onChange={(e) => {
                        setNewQuote({ ...newQuote, author: e.target.value });
                        setSelectedAuthor('');
                      }}
                      required
                    />
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="authorRadio"
                          checked={selectedAuthor === 'storythur'}
                          onChange={() => handleAuthorSelect('storythur')}
                          className="w-4 h-4 text-[#355485]"
                        />
                        <span className="text-sm">storythur</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="authorRadio"
                          checked={selectedAuthor === 'fatkhurrhn'}
                          onChange={() => handleAuthorSelect('fatkhurrhn')}
                          className="w-4 h-4 text-[#355485]"
                        />
                        <span className="text-sm">fatkhurrhn</span>
                      </label>
                    </div>
                  </div>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4f90c6]"
                    value={newQuote.category}
                    onChange={(e) => setNewQuote({ ...newQuote, category: e.target.value })}
                  >
                    <option value="motivation">Motivasi</option>
                    <option value="life">Reminder</option>
                    <option value="love">Cinta</option>
                    <option value="wisdom">Kebijaksanaan</option>
                    <option value="funny">Lucu</option>
                    <option value="other">Lainnya</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#355485] text-white rounded-xl font-medium flex items-center justify-center disabled:opacity-70 hover:bg-[#2a436c] transition"
                  >
                    {isLoading ? <><i className="ri-loader-4-line animate-spin mr-2"></i>Menambahkan...</> : 'Tambah Quote'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Quotes Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700 text-sm">
            <div className="col-span-5 sm:col-span-5">Quote</div>
            <div className="col-span-3 sm:col-span-2">Author</div>
            <div className="col-span-2 hidden sm:block">Category</div>
            <div className="col-span-2 sm:col-span-2">Status</div>
            <div className="col-span-2 sm:col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <div key={quote.id} className="grid grid-cols-12 p-4 items-center text-sm">
                  <div className="col-span-5 sm:col-span-5 text-gray-800 line-clamp-2 pr-2">"{quote.text}"</div>
                  <div className="col-span-3 sm:col-span-2 text-gray-600">{quote.author}</div>
                  <div className="col-span-2 hidden sm:block">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(quote.category)}`}>
                      {getCategoryLabel(quote.category)}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <select
                      className={`text-xs px-2 py-1 rounded-full border ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          quote.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-red-100 text-red-800 border-red-200'
                        }`}
                      value={quote.status || 'pending'}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-3">
                    <button onClick={() => handleEdit(quote)} className="text-blue-500 hover:text-blue-700" title="Edit">
                      <i className="ri-edit-line text-lg"></i>
                    </button>
                    <button onClick={() => handleDelete(quote.id)} className="text-red-500 hover:text-red-700" title="Delete">
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">Tidak ada quotes yang ditemukan</div>
            )}
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <i className="ri-history-line"></i> History Tambah Quote
              </h3>
              <button onClick={clearHistory} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                <i className="ri-delete-bin-line"></i> Clear
              </button>
            </div>
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {history.map((item) => (
                <div key={item.id} className="p-3 hover:bg-gray-50">
                  <p className="text-gray-800 text-sm">"{item.text.substring(0, 80)}{item.text.length > 80 ? '...' : ''}"</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span><i className="ri-user-line"></i> {item.author}</span>
                    <span><i className="ri-price-tag-3-line"></i> {getCategoryLabel(item.category)}</span>
                    <span><i className="ri-time-line"></i> {new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuotes;