import { useEffect, useState } from "react";
import "./ClientsTable.css";
import ClientActions from "./ClientActions";
import AddClientModal from "./AddClientModal";

import axios from "axios";

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>
  );
};

const ClientsTable = () => {
  const [tableData, setTableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const loggedInUserName = JSON.parse(localStorage.getItem("user"));
  console.log(loggedInUserName.user.email);

  const handleEdit = (updatedClient) => {
    setTableData((prevData) =>
      prevData.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const handleDelete = (id) => {
    setTableData((prevData) => prevData.filter((client) => client.id !== id)); // Use custom `id`
  };

  const [query, setQuery] = useState("");
  useEffect(() => {
    axios
      .get(
        `http://54.167.18.161/api/clients?user=${loggedInUserName.user.email}`
      )
      .then(async (res) => {
        setTableData(res.data);
      });
  }, []);

  const filtered = tableData.filter(
    (client) =>
      client.name.toLowerCase().includes(query.toLowerCase()) ||
      client.caseType.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className=" bg-gray-50"
      style={{ paddingLeft: "5rem", paddingRight: "5rem", paddingTop: "1rem" }}
    >
      <div className="clients-container">
        <div className="header-container">
          <div className="button-container">
            <button
              onClick={() => setModalOpen(true)}
              className="add-client-btn"
            >
              Add Client
            </button>
            <button className="import-btn">Import</button>
          </div>
          <div className="search-container">
            <input
              type="search"
              placeholder="Search clients..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div
          className="table-container "
          style={{
            borderRadius: "1rem",
            boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
          }}
        >
          <table
            className="clients-table  "
            style={{
              borderRadius: "1rem",
              boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
            }}
          >
            <thead>
              <tr className="table-header border">
                <th>Client Name</th>
                <th>Case Type</th>
                <th>Status</th>
                <th>Last Contact</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="table-row border">
                  <td>{client.name}</td>
                  <td>{client.caseType}</td>
                  <td>
                    <StatusBadge status={client.status} />
                  </td>
                  <td>{client.lastContact}</td>
                  <td style={{ textAlign: "right" }}>
                    <ClientActions
                      client={client}
                      onEdit={handleEdit} // Pass handleEdit function
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AddClientModal logic added below */}
        {modalOpen && (
          <AddClientModal
            onClose={() => setModalOpen(false)}
            onAdd={async (newClient) => {
              newClient.created_by = loggedInUserName.user.email;
              await axios.post(
                "http://54.167.18.161/api/clients/add",
                newClient
              );
              setTableData([...tableData, newClient]);
              setModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ClientsTable;
