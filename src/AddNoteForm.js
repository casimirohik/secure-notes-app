import React, { useState } from 'react';

function AddNoteForm({ addNote }) {
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote(note);  // This will be passed down from the parent component
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md"
        rows="4"
        placeholder="Write your secure note here..."
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
        Add Note
      </button>
    </form>
  );
}

export default AddNoteForm;
