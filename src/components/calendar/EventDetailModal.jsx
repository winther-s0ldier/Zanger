import React from 'react';
import './EventDetailModal.css';

const EventDetailModal = ({ event, onClose, onDelete }) => {
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event._id);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Event Details</h2>
          <button 
            type="button" 
            className="modal-close" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="event-details">
          <h3>{event.title}</h3>
          
          {event.description && (
            <p className="description">{event.description}</p>
          )}

          <div className="detail-row">
            <span className="label">Starts:</span>
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="detail-row">
            <span className="label">Ends:</span>
            <span>{formatDate(event.endDate)}</span>
          </div>

          <div className="detail-row">
            <span className="label">Type:</span>
            <span className={`event-type ${event.type}`}>
              {event.type}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Status:</span>
            <span className={`event-status ${event.status}`}>
              {event.status}
            </span>
          </div>

          {event.clientId && (
            <div className="detail-row">
              <span className="label">Client:</span>
              <span>{event.clientId}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="label">Created:</span>
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-delete" 
            onClick={handleDelete}
          >
            Delete Event
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;