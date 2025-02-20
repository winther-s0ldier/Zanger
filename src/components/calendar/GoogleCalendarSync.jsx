import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './GoogleCalendarSync.css';

const GoogleCalendarSync = ({ onClose, onSync }) => {
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const handleSync = async () => {
        setSyncing(true);
        setError(null);
        try {
            const response = await axios.get('http://54.167.18.161/api/calendar/google/auth', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            
            // Redirect to Google OAuth
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Failed to initiate Google sync:', error);
            setError('Failed to connect to Google Calendar. Please try again.');
        } finally {
            setSyncing(false);
        }
    };

    const handleDisableSync = async () => {
        setSyncing(true);
        setError(null);
        try {
            await axios.post('http://54.167.18.161/api/calendar/google/disable', {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            onClose();
        } catch (error) {
            console.error('Failed to disable sync:', error);
            setError('Failed to disable Google Calendar sync. Please try again.');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Sync with Google Calendar</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <p>This will sync your events with Google Calendar. Your existing events will be preserved.</p>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="sync-options">
                        <label className="checkbox-container">
                            <input 
                                type="checkbox" 
                                defaultChecked={true}
                                disabled={syncing}
                            />
                            <span className="checkmark"></span>
                            Import events from Google Calendar
                        </label>
                        
                        <label className="checkbox-container">
                            <input 
                                type="checkbox" 
                                defaultChecked={true}
                                disabled={syncing}
                            />
                            <span className="checkmark"></span>
                            Export events to Google Calendar
                        </label>
                    </div>
                </div>

                <div className="modal-footer">
                    {user?.googleCalendarSyncEnabled ? (
                        <button 
                            className="btn-danger"
                            onClick={handleDisableSync}
                            disabled={syncing}
                        >
                            Disable Sync
                        </button>
                    ) : null}
                    <button 
                        className="btn-cancel" 
                        onClick={onClose}
                        disabled={syncing}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn-sync" 
                        onClick={handleSync}
                        disabled={syncing}
                    >
                        {syncing ? 'Connecting...' : 'Connect to Google Calendar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoogleCalendarSync;
