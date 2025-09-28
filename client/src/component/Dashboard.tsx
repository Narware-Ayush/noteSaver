import React, { useState } from "react";

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  // Mock logged-in user data
  const tokens=JSON.parse(localStorage.getItem("usernote")|| 'false');
  const [user] = useState<User>({ name:tokens.name, email:tokens.email });

  // Notes states
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setNotes([...notes, input]);
    setInput("");
    setShowInput(false);
  };

  const deleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-0">
  {/* Navbar */}
  <nav className="bg-white shadow-md w-full px-8 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
    <a
      href="/login"
      className="text-blue-500 font-semibold hover:text-blue-700"
    >
      Sign Out
    </a>
  </nav>

  <div className="p-8">
    {/* User Card */}
    <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome, {user.name}
      </h2>
      <p className="text-gray-600">Email: {user.email}</p>
    </div>

    {/* Notes Section */}
    <div className="flex flex-col items-center">
      {/* Create Note Button or Input */}
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="w-full max-w-md bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 mb-6"
        >
          Create Note
        </button>
      ) : (
        <form onSubmit={addNote} className="flex gap-2 w-full max-w-md mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your note..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="bg-gray-400 text-white px-4 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Notes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-700 mb-3">Notes</h1>
        {notes.map((note, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 relative cursor-pointer"
          >
            {/* Card Header */}
            <div
              onClick={() => toggleExpand(index)}
              className="font-semibold text-gray-800"
            >
              {`Note ${index + 1}`}
            </div>

            {/* Expanded content */}
            {expandedIndex === index && (
              <p className="text-gray-700 mt-2">{note}</p>
            )}

            {/* Delete button */}
            <button
              onClick={() => deleteNote(index)}
              className="absolute top-2 right-2 text-blue-500 hover:text-black-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
  )
}