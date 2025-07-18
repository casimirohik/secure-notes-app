import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { motion, AnimatePresence } from 'framer-motion';
import DecryptModal from './DecryptModal';
import { Eye, EyeOff, Trash2, Sun, Moon, Lock, Plus, X } from 'lucide-react';

const App = () => {
  const hardcodedPassword = 'password';
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [decryptedNote, setDecryptedNote] = useState(null);
  const [decryptError, setDecryptError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalNoteObj, setModalNoteObj] = useState(null);
  const [expandedNoteIndex, setExpandedNoteIndex] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = () => {
    if (password === hardcodedPassword) {
      setLoggedIn(true);
    } else {
      alert('Invalid password!');
    }
  };

  const handleAddNote = () => {
    if (!title.trim() || !note.trim()) return;
    const encryptedNote = CryptoJS.AES.encrypt(note, hardcodedPassword).toString();
    const newNotes = [...notes, { title, encryptedNote }];
    setNotes(newNotes);
    setTitle('');
    setNote('');
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const openDecryptModal = (noteObj) => {
    setModalNoteObj(noteObj);
    setShowModal(true);
  };

  const handleModalDecrypt = (userPassword) => {
    if (modalNoteObj) {
      try {
        const bytes = CryptoJS.AES.decrypt(modalNoteObj.encryptedNote, userPassword);
        const originalNote = bytes.toString(CryptoJS.enc.Utf8);
        if (originalNote) {
          setDecryptedNote({ title: modalNoteObj.title, content: originalNote });
          setDecryptError('');
        } else {
          setDecryptedNote(null);
          setDecryptError('Incorrect password!');
        }
      } catch (error) {
        setDecryptedNote(null);
        setDecryptError('Error decrypting note');
      }
    }
    setShowModal(false);
  };

  const handleDeleteAllNotes = () => {
    setNotes([]);
    localStorage.removeItem('notes');
    setDecryptedNote(null);
    setDecryptError('');
    setExpandedNoteIndex(null);
  };

  const handleCloseDecryptedNote = () => {
    setDecryptedNote(null);
    setDecryptError('');
  };

  const toggleNoteExpansion = (index) => {
    setExpandedNoteIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Lock className="text-emerald-500" size={24} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              SecureNoteX
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
              Your private notes. Encrypted, always.
            </p>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {!loggedIn ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-9rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-8">
                <div className="text-center mb-6">
                  <Lock className="mx-auto h-12 w-12 text-emerald-500" />
                  <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter your password to access your notes
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                  >
                    <Lock size={18} />
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Note */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Plus className="mr-2 text-emerald-500" size={20} />
                  Create New Note
                </h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Enter your note content"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full h-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={handleAddNote}
                    disabled={!title.trim() || !note.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition duration-200"
                  >
                    Encrypt & Save Note
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Saved Notes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Lock className="mr-2 text-emerald-500" size={20} />
                    Your Encrypted Notes
                  </h2>
                  {notes.length > 0 && (
                    <button
                      onClick={handleDeleteAllNotes}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg transition flex items-center space-x-1"
                    >
                      <Trash2 size={16} />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {notes.length > 0 ? (
                  <ul className="space-y-3">
                    {notes.map((noteObj, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                      >
                        <div
                          className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                          onClick={() => toggleNoteExpansion(index)}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {noteObj.title}
                            </h3>
                            <span className="text-gray-500 dark:text-gray-400">
                              {expandedNoteIndex === index ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                          </div>

                          {expandedNoteIndex === index && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-xs font-mono break-all text-gray-500 dark:text-gray-400 mb-3">
                                {noteObj.encryptedNote}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDecryptModal(noteObj);
                                }}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded text-sm transition flex items-center justify-center space-x-1"
                              >
                                <Lock size={14} />
                                <span>Decrypt Note</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4">
                      <Lock size={64} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      No notes yet
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Create your first encrypted note to get started
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Decrypted Note Display */}
        <AnimatePresence>
          {decryptedNote && (
            <motion.div
              key="decrypted-note"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 border border-emerald-500/30 overflow-hidden"
                layoutId="decrypted-note"
              >
                <div className="p-6">
                  <button
                    onClick={handleCloseDecryptedNote}
                    className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    <X size={20} />
                  </button>
                  <h4 className="text-xl font-bold text-emerald-500 mb-1">Decrypted Message</h4>
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {decryptedNote.title}
                  </h5>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                      {decryptedNote.content}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    onClick={handleCloseDecryptedNote}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-4 rounded text-sm transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decryption error */}
        {decryptError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {decryptError}
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <DecryptModal
              onSubmit={handleModalDecrypt}
              onCancel={() => setShowModal(false)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} SecureNoteX - Keeping your notes safe, always.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            "Because your privacy matters!"
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;