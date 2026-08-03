import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Assignment() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // CRUD State for Assignments
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  // AUTH GUARD & INITIAL DATA FETCH
  useEffect(() => {
    const token = localStorage.getItem('eduflow_token');
    const loggedUser = JSON.parse(localStorage.getItem('eduflow_logged_user'));

    // Check if user is logged in
    if (!token || !loggedUser) {
      navigate('/login');
      return;
    }

    setCurrentUser(loggedUser);
    fetchAssignments();
  }, [navigate]);

  // READ Operation - Fetch from MongoDB Atlas API
  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/api/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments from MongoDB:', error);
      // Fallback local storage backup if backend server is offline
      const savedAssignments = JSON.parse(localStorage.getItem('eduflow_assignments')) || [];
      setAssignments(savedAssignments);
    }
  };

  // CREATE / UPDATE Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // UPDATE Operation -> MongoDB
      try {
        const response = await axios.put(`/api/assignments/${editingId}`, {
          title,
          subject,
          dueDate,
        });
        setAssignments(
          assignments.map((item) => (item._id === editingId || item.id === editingId ? response.data : item))
        );
      } catch (error) {
        // Fallback local update
        const updatedList = assignments.map((item) =>
          item.id === editingId || item._id === editingId ? { ...item, title, subject, dueDate } : item
        );
        setAssignments(updatedList);
        localStorage.setItem('eduflow_assignments', JSON.stringify(updatedList));
      }
      setEditingId(null);
    } else {
      // CREATE Operation -> MongoDB
      const newAssignment = {
        title,
        subject,
        dueDate,
        status: 'Pending',
        user: currentUser?.name || 'Anonymous',
      };

      try {
        const response = await axios.post('/api/assignments', newAssignment);
        setAssignments([response.data, ...assignments]);
      } catch (error) {
        // Fallback local create
        const localItem = { ...newAssignment, id: Date.now() };
        const updatedList = [localItem, ...assignments];
        setAssignments(updatedList);
        localStorage.setItem('eduflow_assignments', JSON.stringify(updatedList));
      }
    }

    // Reset Form Fields
    setTitle('');
    setSubject('');
    setDueDate('');
  };

  // EDIT Trigger
  const handleEdit = (assignment) => {
    setEditingId(assignment._id || assignment.id);
    setTitle(assignment.title);
    setSubject(assignment.subject);
    setDueDate(assignment.dueDate);
  };

  // DELETE Handler -> MongoDB
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/assignments/${id}`);
      setAssignments(assignments.filter((item) => item._id !== id && item.id !== id));
    } catch (error) {
      const filteredList = assignments.filter((item) => item.id !== id && item._id !== id);
      setAssignments(filteredList);
      localStorage.setItem('eduflow_assignments', JSON.stringify(filteredList));
    }
  };

  // TOGGLE STATUS Handler -> MongoDB
  const toggleStatus = async (item) => {
    const id = item._id || item.id;
    const newStatus = item.status === 'Pending' ? 'Completed' : 'Pending';

    try {
      const response = await axios.put(`/api/assignments/${id}`, { status: newStatus });
      setAssignments(assignments.map((a) => ((a._id === id || a.id === id) ? response.data : a)));
    } catch (error) {
      const updatedList = assignments.map((a) =>
        (a.id === id || a._id === id) ? { ...a, status: newStatus } : a
      );
      setAssignments(updatedList);
      localStorage.setItem('eduflow_assignments', JSON.stringify(updatedList));
    }
  };

  // LOGOUT Handler
  const handleLogout = () => {
    localStorage.removeItem('eduflow_token');
    localStorage.removeItem('eduflow_logged_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <nav className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white shadow-lg py-4 px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <i className="fas fa-graduation-cap"></i> EduFlow Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-medium bg-white/20 px-4 py-1.5 rounded-full text-sm">
            👤 {currentUser?.name} ({currentUser?.role || 'Student'})
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-emerald-700 px-4 py-1.5 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Module Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-800">Assignment Tracker & Manager</h1>
          <p className="text-gray-500 mt-1">MongoDB Atlas Backend: Full Real-Time Persistence</p>
        </div>

        {/* CREATE / UPDATE FORM */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-700 mb-4">
            {editingId ? '✏️ Edit Assignment' : '➕ Create New Assignment'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Assignment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <input
              type="text"
              placeholder="Subject / Course"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <div className="md:col-span-3 flex gap-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
              >
                {editingId ? 'Update Assignment' : 'Add Assignment'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle('');
                    setSubject('');
                    setDueDate('');
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* READ / LIST VIEW */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-700 mb-4">📖 Active Assignments ({assignments.length})</h2>

          {assignments.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No assignments added yet. Add one above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-slate-50 text-slate-600 text-sm">
                    <th className="p-3">Title</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((item, idx) => {
                    const itemId = item._id || item.id || idx;
                    return (
                      <tr key={itemId} className="border-b border-gray-100 hover:bg-emerald-50/30 transition">
                        <td className="p-3 font-medium">{item.title}</td>
                        <td className="p-3 text-gray-600">{item.subject}</td>
                        <td className="p-3 text-gray-600">{item.dueDate}</td>
                        <td className="p-3">
                          <span
                            onClick={() => toggleStatus(item)}
                            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-bold ${
                              item.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(itemId)}
                            className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assignment;
