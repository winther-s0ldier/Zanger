// FilesList.jsx
import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { useAuth } from "../../context/AuthContext";

function FilesList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user } = useAuth();

  const fetchFiles = useCallback(async () => {
    if (!user?.token) {
      setLoading(false);
      setError('Authentication required');
      return;
    }

    try {
      const response = await fetch("https://first-work-2.onrender.com/api/files", {
        headers: { 
          Authorization: `Bearer ${user.token}` 
        },
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 
            ? 'Authentication failed' 
            : 'Failed to fetch files'
        );
      }

      const data = await response.json();
      setFiles(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      setError('Authentication required');
      return;
    }

    const newSocket = io("https://first-work-2.onrender.com", {
      auth: { token: user.token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected:", newSocket.id);
      fetchFiles();
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError("Failed to establish real-time connection");
      setLoading(false);
    });

    newSocket.on("fileUploaded", (newFile) => {
      console.log("File uploaded event received:", newFile);
      setFiles((prevFiles) => [newFile, ...prevFiles]);
      setLoading(false);
    });

    newSocket.on("fileDeleted", (deletedFileId) => {
      console.log("File deleted event received:", deletedFileId);
      setFiles((prevFiles) => 
        prevFiles.filter((file) => file._id !== deletedFileId)
      );
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        console.log("Cleaning up socket connection");
        newSocket.off("connect");
        newSocket.off("connect_error");
        newSocket.off("fileUploaded");
        newSocket.off("fileDeleted");
        newSocket.close();
      }
    };
  }, [user?.token, fetchFiles]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading file:", file.name);
      
      const response = await fetch("https://first-work-2.onrender.com/api/files/upload", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${user.token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }

      const data = await response.json();
      console.log("Upload response:", data);

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://first-work-2.onrender.com/api/files/${fileId}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${user.token}` 
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setError(error.message);
      fetchFiles();
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    const iconMap = {
      'pdf': 'file-pdf',
      'doc': 'file-word',
      'docx': 'file-word',
      'xls': 'file-excel',
      'xlsx': 'file-excel',
      'png': 'file-image',
      'jpg': 'file-image',
      'jpeg': 'file-image',
      'gif': 'file-image',
      'txt': 'file-alt',
      'csv': 'file-csv',
      'zip': 'file-archive',
      'rar': 'file-archive'
    };

    return iconMap[fileType.toLowerCase()] || 'file';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="files-list">
      {error && (
        <div className="alert alert-danger" role="alert">
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-circle me-2"></i>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {uploadSuccess && (
        <div className="alert alert-success text-center">
          <i className="fas fa-check-circle me-2"></i>
          File uploaded successfully!
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Uploaded Files</h5>
        <div className="d-flex align-items-center">
          <input 
            type="file" 
            id="fileInput"
            name="file"
            onChange={handleFileChange} 
            className="form-control me-2"
            disabled={loading}
          />
        </div>
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
                        <i className={`fas fa-${getFileIcon(file.fileType)} me-2`}></i>
                        {file.filename}
                      </h6>
                      <p className="card-text text-muted small mb-0">
                        Uploaded on {new Date(file.createdAt).toLocaleDateString()}
                        {file.size && ` • ${formatFileSize(file.size)}`}
                      </p>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-info me-2">
                        {file.fileType.toUpperCase()}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => window.open(`https://first-work-2.onrender.com/uploads/${file.path}`)}
                        disabled={loading}
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        Open
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(file._id)}
                        disabled={loading}
                      >
                        <i className="fas fa-trash-alt me-1"></i>
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
          <p className="text-muted small">
            Upload your first file using the input above
          </p>
        </div>
      )}
    </div>
  );
}

export default FilesList;
