import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Email.css';

const EmailDashboard = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.googleToken) {
      fetchEmails();
    } else {
      setError('Please log in with Google to access emails');
      setLoading(false);
    }
  }, [user, currentFolder]);

  const fetchEmails = async () => {
    try {
      const response = await fetch(`https://first-work-2.onrender.com/api/emails/${currentFolder}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'X-Google-Token': user?.googleToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setEmails(data);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://first-work-2.onrender.com/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
          'X-Google-Token': user?.googleToken
        },
        body: JSON.stringify(newEmail)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setComposing(false);
      setNewEmail({ to: '', subject: '', body: '' });
      fetchEmails();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelectEmail = (emailId) => {
    setSelectedEmails(prev => {
      if (prev.includes(emailId)) {
        return prev.filter(id => id !== emailId);
      }
      return [...prev, emailId];
    });
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email.id));
    }
  };

  if (!user?.googleToken) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          Please log in with Google to access your emails.
        </div>
      </div>
    );
  }

  return (
    <div className="email-container">
      {/* Left Sidebar */}
      <div className="email-sidebar">
        <button 
          className="compose-btn"
          onClick={() => setComposing(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Compose
        </button>

        <div className="folder-list">
          <div 
            className={`folder-item ${currentFolder === 'inbox' ? 'active' : ''}`}
            onClick={() => setCurrentFolder('inbox')}
          >
            <i className="fas fa-inbox me-2"></i>
            Inbox
          </div>
          <div 
            className={`folder-item ${currentFolder === 'starred' ? 'active' : ''}`}
            onClick={() => setCurrentFolder('starred')}
          >
            <i className="fas fa-star me-2"></i>
            Starred
          </div>
          <div 
            className={`folder-item ${currentFolder === 'important' ? 'active' : ''}`}
            onClick={() => setCurrentFolder('important')}
          >
            <i className="fas fa-exclamation me-2"></i>
            Important
          </div>
          <div 
            className={`folder-item ${currentFolder === 'sent' ? 'active' : ''}`}
            onClick={() => setCurrentFolder('sent')}
          >
            <i className="fas fa-paper-plane me-2"></i>
            Sent
          </div>
          <div 
            className={`folder-item ${currentFolder === 'drafts' ? 'active' : ''}`}
            onClick={() => setCurrentFolder('drafts')}
          >
            <i className="fas fa-file me-2"></i>
            Drafts
          </div>
          <div 
            className={`folder-item ${currentFolder === 'spam' ? 'active' : ''}`}
            onClick={() => setCurrentFolder('spam')}
          >
            <i className="fas fa-exclamation-triangle me-2"></i>
            Spam
          </div>
          <div 
            className={`folder-item ${currentFolder === 'trash' ? 'active' : ''}`}
            onClick={() => setCurrentFolder('trash')}
          >
            <i className="fas fa-trash me-2"></i>
            Trash
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="email-content">
        {error && (
          <div className="alert alert-danger m-3" role="alert">
            {error}
          </div>
        )}

        {/* Email List */}
        <div className="email-list-header">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              checked={selectedEmails.length === emails.length}
              onChange={handleSelectAll}
              className="me-3"
            />
            <div className="email-actions">
              <button className="btn btn-link">
                <i className="fas fa-redo"></i>
              </button>
              <button className="btn btn-link">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="email-list">
            {emails.length === 0 ? (
              <div className="text-center p-4 text-muted">
                No emails in this folder
              </div>
            ) : (
              emails.map((email) => (
                <div 
                  key={email.id} 
                  className={`email-item ${selectedEmails.includes(email.id) ? 'selected' : ''}`}
                >
                  <div className="email-item-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email.id)}
                      onChange={() => handleSelectEmail(email.id)}
                    />
                  </div>
                  <div className="email-item-star">
                    <i className="far fa-star"></i>
                  </div>
                  <div className="email-item-sender">{email.from}</div>
                  <div className="email-item-content">
                    <span className="email-item-subject">{email.subject}</span>
                    <span className="email-item-snippet">{email.snippet}</span>
                  </div>
                  <div className="email-item-date">
                    {new Date(email.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {composing && (
        <div className="compose-modal">
          <div className="compose-header">
            <span>New Message</span>
            <div className="compose-actions">
              <button className="btn btn-link" onClick={() => setComposing(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          <form onSubmit={handleSendEmail}>
            <input
              type="email"
              className="compose-input"
              placeholder="To"
              value={newEmail.to}
              onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
              required
            />
            <input
              type="text"
              className="compose-input"
              placeholder="Subject"
              value={newEmail.subject}
              onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
              required
            />
            <textarea
              className="compose-body"
              placeholder="Message"
              value={newEmail.body}
              onChange={(e) => setNewEmail({...newEmail, body: e.target.value})}
              required
            />
            <div className="compose-footer">
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmailDashboard;
