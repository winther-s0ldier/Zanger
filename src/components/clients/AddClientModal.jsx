import { useState } from "react";
import axios from "axios"; // Import axios
import "./AddClientModal.css";

const AddClientModal = ({ onClose, onAdd }) => {
  const loggedInUserName = JSON.parse(localStorage.getItem("user"));  
  const [formData, setFormData] = useState({
    name: "",
    caseType: "",
    status: "Active",
    lastContact: new Date().toLocaleDateString(),
    created_by:loggedInUserName.user.email
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://54.85.178.85/api/clients/add", // Replace with actual API endpoint
        formData
      );

      onAdd(response.data); // Update parent component with new client
      setFormData({
        name: "",
        caseType: "",
        status: "Active",
        lastContact: new Date().toLocaleDateString(),
        created_by:loggedInUserName.user.email
      });
      onClose(); // Close modal after adding client
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Failed to add client.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Client</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clientName">Client Name</label>
            <input
              id="clientName"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter client name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="caseType">Case Type</label>
            <select
              id="caseType"
              value={formData.caseType}
              onChange={(e) =>
                setFormData({ ...formData, caseType: e.target.value })
              }
              required
            >
              <option value="">Select Case Type</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="IP Rights">IP Rights</option>
              <option value="Family Law">Family Law</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
