import React from 'react';

function NoteCard({ note }) {
  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
      <p>{note}</p>
    </div>
  );
}

export default NoteCard;
