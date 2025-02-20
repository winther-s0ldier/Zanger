import { useState } from "react";
import axios from "axios";

import "./ClientActions.css";
import EditClientModal from "./EditClientModal"; // Import EditClientModal
import ViewClientModal from "./ViewClientModal"; // Import ViewClientModal

const ClientActions = ({ client, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal state for editing
  const [viewModalOpen, setViewModalOpen] = useState(false); // Modal state for viewing details

  const handleEdit = () => {
    setEditModalOpen(true); // Open the edit modal
    setIsOpen(false); // Close the actions menu
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      axios
        .delete(`http://54.167.18.161/api/clients/delete/${client.id}`)
        .then(() => {
          onDelete(client.id);
        })
        .catch((error) => {
          console.error("Error deleting client:", error);
          alert("Failed to delete the client. Please try again.");
        });
    }
    setIsOpen(false);
  };

  const handleViewDetails = () => {
    setViewModalOpen(true); // Open the view details modal
    setIsOpen(false); // Close the actions menu
  };

  const handleUpdate = (updatedClient) => {
    onEdit(updatedClient); // Update client data in parent (ClientsTable)
  };

  return (
    <div className="actions-container">
      <button className="actions-button" onClick={() => setIsOpen(!isOpen)}>
        ⋮
      </button>

      {isOpen && (
        <div className="actions-menu">
          <button onClick={handleViewDetails}>View Details</button>
          <button onClick={handleEdit}>Edit</button>
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      {editModalOpen && (
        <EditClientModal
          client={client} // Pass client data to modal
          onClose={() => setEditModalOpen(false)} // Close the modal
          onUpdate={handleUpdate} // Handle update in parent
        />
      )}

      {viewModalOpen && (
        <ViewClientModal
          client={client} // Pass client data to modal
          onClose={() => setViewModalOpen(false)} // Close the view details modal
        />
      )}
    </div>
  );
};

export default ClientActions;
