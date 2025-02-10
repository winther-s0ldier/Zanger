import React from "react";
import "./ViewClientModal.css";

const ViewClientModal = ({ client, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Client Details</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>
            <strong>Client Name:</strong> {client.name}
          </p>
          <p>
            <strong>Case Type:</strong> {client.caseType}
          </p>
          <p>
            <strong>Status:</strong> {client.status}
          </p>
          <p>
            <strong>Last Contact:</strong> {client.lastContact}
          </p>
          <p>
            <strong>Created By:</strong> {client.created_by}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewClientModal;
