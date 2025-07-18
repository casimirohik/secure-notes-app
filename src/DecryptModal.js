import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, X } from 'lucide-react';

const DecryptModal = ({ onSubmit, onCancel }) => {
  const [decryptionPassword, setDecryptionPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(decryptionPassword);
    setDecryptionPassword('');
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="p-6">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-500">
              <Lock size={24} />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Decrypt Note
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Enter the password to decrypt this note
          </p>
          
          <div className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter decryption password"
                value={decryptionPassword}
                onChange={(e) => setDecryptionPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!decryptionPassword.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <Lock size={18} />
                <span>Decrypt</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DecryptModal;