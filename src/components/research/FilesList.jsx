// components/files/FilesList.jsx
import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";

function FilesList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFiles = async () => {
    try {
      const response = await fetch('https://first-work-2.onrender.com/api/files', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(`https://first-work-2.onrender.com/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // Remove file from state
      setFiles(files.filter(f => f._id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchFiles();
    }
  }, [user]);

  return (
    <div className="files-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Uploaded Files</h5>
      </div>
      
      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : files.length > 0 ? (
        <div className="row g-3">
          {files.map((file) => (
            <div key={file._id} className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="card-title mb-1">
                        <i className="fas fa-file me-2"></i>
                        {file.filename}
                      </h6>
                      <p className="card-text text-muted small">
                        Uploaded on {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="badge bg-info me-2">
                        {file.fileType}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => window.open(`https://first-work-2.onrender.com/uploads/${file.path}`)}
                      >
                        Open
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(file._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4">
          <i className="fas fa-file fa-2x mb-3 text-muted"></i>
          <p className="text-muted">No files uploaded yet</p>
        </div>
      )}
    </div>
  );
}

export default FilesList;
