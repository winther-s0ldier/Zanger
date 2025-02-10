// src/components/research/Research.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import AddTaskModal from "./AddTaskModal";
import FilesList from "./FilesList";

function Research() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    local: true,
    web: true,
  });
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeDropdown &&
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".dropdown-toggle")
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // Handle delete priority task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:3030/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete task");
      setPriorityTasks(priorityTasks.filter((task) => task._id !== taskId));
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle delete update
  const handleDeleteUpdate = async (updateId) => {
    try {
      const response = await fetch(
        `http://localhost:3030/api/updates/${updateId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete update");
      setRecentUpdates(
        recentUpdates.filter((update) => update._id !== updateId)
      );
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error deleting update:", error);
    }
  };

  // Fetch priority tasks
  const fetchPriorityTasks = async () => {
    try {
      const response = await fetch("http://localhost:3030/api/tasks", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setPriorityTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3030/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      // Trigger a new search if there's a current search query
      if (searchQuery.length >= 3) {
        handleSearch();
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Fetch recent updates
  const fetchRecentUpdates = async () => {
    const loggedinuser = JSON.parse(localStorage.getItem("user"));
    console.log(loggedinuser.user.email);

    try {
      const response = await fetch(
        `http://localhost:3030/api/updates/recent?email=${loggedinuser.user.email}`,
        {
          headers: {
            Authorization: `Bearer ${loggedinuser.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch updates");
      const data = await response.json();
      setRecentUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  // Handle adding new task
  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch("http://localhost:3030/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to add task");
      await fetchPriorityTasks();
      setShowAddTask(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Filter results based on search filters
  const filteredResults = useMemo(() => {
    if (!searchResults.length) return [];

    return searchResults.filter((result) => {
      if (result.source === "Local" && !searchFilters.local) return false;
      if (result.source === "DuckDuckGo" && !searchFilters.web) return false;
      return true;
    });
  }, [searchResults, searchFilters]);

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3030/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPriorityTasks();
    fetchRecentUpdates();
  }, []);

  // Search debounce effect
  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchQuery.length >= 3) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  // Priority Task Item Component
  const PriorityTaskItem = ({ task }) => (
    <div key={task._id} className="task-item mb-3 p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">{task.title}</h6>
          <small className="text-muted">
            {new Date(task.dateTime).toLocaleString("en-US", {
              weekday: "long",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </small>
        </div>
        <div className="d-flex align-items-center">
          <span
            className={`badge ${
              task.type === "Meeting"
                ? "bg-primary opacity-75"
                : task.type === "Deadline"
                ? "bg-danger opacity-75"
                : "bg-secondary opacity-75"
            }`}
          >
            {task.type}
          </span>
          <div className="dropdown">
            <button
              className="btn btn-link btn-sm text-muted ms-2 dropdown-toggle"
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === `task-${task._id}`
                    ? null
                    : `task-${task._id}`
                )
              }
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            {activeDropdown === `task-${task._id}` && (
              <div
                className="dropdown-menu show"
                style={{
                  position: "absolute",
                  transform: "translate3d(-120px, 20px, 0px)",
                }}
              >
                <button
                  className="dropdown-item text-danger"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <i className="fas fa-trash-alt me-2"></i>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Recent Update Item Component
  const RecentUpdateItem = ({ update }) => (
    <div key={update._id} className="d-flex align-items-start mb-4">
      <div className="bg-light rounded-circle p-2 me-3">
        <i className={`far fa-file-alt text-primary`}></i>
      </div>
      <div className="flex-grow-1">
        <h6 className="mb-1">{update.title}</h6>
        <p className="mb-1 text-muted">{update.description}</p>
        <small className="text-muted">
          by {update.author} • {update.timeAgo}
        </small>
      </div>
      <div className="dropdown">
        <button
          className="btn btn-link btn-sm p-0 text-muted dropdown-toggle"
          onClick={() =>
            setActiveDropdown(
              activeDropdown === `update-${update._id}`
                ? null
                : `update-${update._id}`
            )
          }
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>
        {activeDropdown === `update-${update._id}` && (
          <div
            className="dropdown-menu show"
            style={{
              position: "absolute",
              transform: "translate3d(-120px, 20px, 0px)",
            }}
          >
            <button
              className="dropdown-item text-danger"
              onClick={() => handleDeleteUpdate(update._id)}
            >
              <i className="fas fa-trash-alt me-2"></i>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        paddingTop: "1.5rem",
        paddingLeft: "5rem",
        paddingRight: "5rem",
      }}
    >
      <div className="container-fluid px-4">
        {/* Search Box and File Upload */}
        <div className="my-4">
          <div className="input-group">
            <span
              className="input-group-text border-end-0 bg-white"
              style={{ boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)" }}
            >
              <i
                className="fa-solid fa-magnifying-glass text-muted"
                style={{
                  height: "2.5rem",
                  paddingTop: "0.8rem",
                  fontSize: "1.2rem",
                }}
              ></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search case law, statutes, legal documents, and uploaded files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                height: "3.8rem",
                boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              onChange={handleFileUpload}
            />
            <button
              className="btn btn-outline-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
              }}
            >
              {uploading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <i className="fas fa-upload me-2"></i>
              )}
              Upload File
            </button>
          </div>
        </div>

        <div className="row">
          {/* Main Content Area */}
          <div className="col-12 col-lg-8 mb-4">
            {/* Search Results */}
            {searchQuery.length >= 3 && (
              <div
                className="card mb-4"
                style={{
                  opacity: "1",
                  border: "0px",
                  boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
                  backgroundColor: "white",
                }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                      <h5 className="card-title mb-0">Search Results</h5>
                      {loading && (
                        <div
                          className="spinner-border spinner-border-sm ms-3"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </div>
                    <div className="btn-group">
                      <button
                        className={`btn ${
                          searchFilters.local
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            local: !prev.local,
                          }))
                        }
                      >
                        <i className="fas fa-database me-2"></i>
                        Local Results
                      </button>
                      <button
                        className={`btn ${
                          searchFilters.web
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            web: !prev.web,
                          }))
                        }
                      >
                        <i className="fas fa-globe me-2"></i>
                        Web Results
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted mt-3">
                        Searching both local and web sources...
                      </p>
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="search-results">
                      {filteredResults.map((result) => (
                        <div
                          key={result._id}
                          className="card mb-3 shadow-sm"
                          style={{
                            transition: "transform 0.2s",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform =
                              "translateY(-2px)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "translateY(0)")
                          }
                        >
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="d-flex align-items-center">
                                <i
                                  className={`fas ${
                                    result.type === "Note"
                                      ? "fa-sticky-note text-primary"
                                      : result.type === "Client"
                                      ? "fa-user text-success"
                                      : result.type === "File"
                                      ? "fa-file text-info"
                                      : result.type === "Calendar"
                                      ? "fa-calendar text-warning"
                                      : result.type === "Web"
                                      ? "fa-globe text-secondary"
                                      : "fa-file text-muted"
                                  } me-3 fa-lg`}
                                ></i>
                                <div>
                                  <h6 className="card-title mb-1">
                                    {result.title}
                                  </h6>
                                  <p className="card-text text-muted small mb-0">
                                    {result.excerpt}
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex flex-column align-items-end">
                                <div className="d-flex gap-2 mb-2">
                                  {result.source && (
                                    <span className="badge bg-light text-dark">
                                      {result.source}
                                    </span>
                                  )}
                                  <span
                                    className={`badge ${
                                      result.type === "Note"
                                        ? "bg-primary"
                                        : result.type === "Client"
                                        ? "bg-success"
                                        : result.type === "File"
                                        ? "bg-info"
                                        : result.type === "Web"
                                        ? "bg-warning"
                                        : "bg-secondary"
                                    }`}
                                  >
                                    {result.type}
                                  </span>
                                </div>
                                {(result.type === "File" ||
                                  result.type === "Web") && (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      if (result.type === "File") {
                                        window.open(
                                          `http://localhost:3030/uploads/${result.path}`
                                        );
                                      } else if (
                                        result.type === "Web" &&
                                        result.url
                                      ) {
                                        window.open(
                                          result.url,
                                          "_blank",
                                          "noopener,noreferrer"
                                        );
                                      }
                                    }}
                                  >
                                    <i
                                      className={`fas ${
                                        result.type === "File"
                                          ? "fa-external-link-alt"
                                          : "fa-arrow-up-right-from-square"
                                      } me-2`}
                                    ></i>
                                    {result.type === "File"
                                      ? "Open File"
                                      : "Visit Website"}
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <small className="text-muted">
                                {new Date(result.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </small>
                              {result.tags && result.tags.length > 0 && (
                                <div className="d-flex gap-2">
                                  {result.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="badge bg-light text-dark"
                                      style={{ fontSize: "0.75rem" }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-search fa-3x mb-3 text-muted"></i>
                      <p className="text-muted mb-0">
                        No results found for "{searchQuery}"
                      </p>
                      <small className="text-muted">
                        Try adjusting your search terms or filters
                      </small>
                    </div>
                  )}

                  {filteredResults.length > 0 && (
                    <div className="text-center mt-4">
                      <small className="text-muted">
                        Showing {filteredResults.length} results
                        {searchFilters.local && searchFilters.web
                          ? " from all sources"
                          : searchFilters.local
                          ? " from local sources"
                          : searchFilters.web
                          ? " from web sources"
                          : ""}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Priority Tasks Section */}
            <div
              className="card"
              style={{
                opacity: "1",
                border: "0px",
                boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
                backgroundColor: "white",
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Priority Tasks</h5>
                  <div>
                    <button
                      className="btn btn-link text-decoration-none"
                      onClick={() => setShowAddTask(true)}
                      style={{ color: "Blue", fontWeight: "500" }}
                    >
                      Add Task
                    </button>
                  </div>
                </div>

                {/* Priority Tasks List */}
                <div className="priority-tasks">
                  {priorityTasks.map((task) => (
                    <PriorityTaskItem key={task._id} task={task} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Updates Section */}
          <div className="col-12 col-lg-4">
            <div
              className="card"
              style={{
                opacity: "1",
                border: "0px",
                boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
                backgroundColor: "white",
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Recent Updates</h5>
                </div>
                <div className="recent-updates">
                  {recentUpdates.map((update) => (
                    <RecentUpdateItem key={update._id} update={update} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div className="card mb-4 mt-4 shadow border-0">
          <div className="card-body">
            <FilesList />
          </div>
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          show={showAddTask}
          onClose={() => setShowAddTask(false)}
          onSubmit={handleAddTask}
        />
      </div>
    </div>
  );
}

export default Research;
