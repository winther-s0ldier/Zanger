import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import NewEventModal from "./NewEventModal";
import EventDetailModal from "./EventDetailModal";
import GoogleCalendarSync from "./GoogleCalendarSync";
import "./CalendarView.css";

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [date]);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      const response = await axios.get("http://54.85.178.85/api/calendar", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log('Fetched events:', response.data);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", {
        message: error.message,
        response: error.response?.data
      });
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      console.log('Attempting to create event with data:', eventData);
      
      const response = await axios.post(
        "http://54.85.178.85/api/calendar",
        eventData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Server response:', response.data);
      setEvents([...events, response.data]);
      setShowNewEventModal(false);
    } catch (error) {
      console.error("Error adding event:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://54.85.178.85/api/calendar/${eventId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setEvents(events.filter(event => event._id !== eventId));
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleGoogleSync = async () => {
    try {
      const response = await axios.post(
        "http://54.85.178.85/api/auth/google/calendar/url",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      await fetchEvents(); // Refresh events after sync
      setShowSyncModal(false);
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error);
    }
  };

  const getEventsForDate = (currentDate) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === currentDate.toDateString();
    });
  };

  const renderEventPill = (event) => (
    <div
      key={event._id}
      className={`event-pill ${event.type}`}
      onClick={() => setSelectedEvent(event)}
      style={{ cursor: 'pointer' }}
      title={`${event.title}`}
    >
      <div className="event-title">{event.title}</div>
      {event.description && (
        <div className="event-description">{event.description}</div>
      )}
    </div>
  );

  const renderCalendarDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="calendar-day empty"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayEvents = getEventsForDate(currentDate);
      const isToday = currentDate.toDateString() === new Date().toDateString();

      days.push(
        <td key={day} className={`calendar-day ${isToday ? "today" : ""}`}>
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.map((event) => renderEventPill(event))}
          </div>
        </td>
      );
    }

    return days;
  };

  const renderCalendarWeeks = () => {
    const days = renderCalendarDays();
    const weeks = [];
    let week = [];

    days.forEach((day, index) => {
      week.push(day);
      if (week.length === 7 || index === days.length - 1) {
        weeks.push(<tr key={`week-${weeks.length}`}>{week}</tr>);
        week = [];
      }
    });

    return weeks;
  };

  return (
    <div className="container" style={{ marginTop: "3rem" }}>
      <div className="calendar-header">
        <div className="calendar-controls">
          <button
            className="btn btn-primary"
            onClick={() => setShowNewEventModal(true)}
          >
            New Event
          </button>
          <button className="btn btn-outline-secondary">Export</button>
        </div>
        <div className="calendar-navigation">
          <button className="btn btn-link" onClick={() => setDate(new Date())}>
            Today
          </button>
          <div className="navigation-arrows">
            <button
              onClick={() =>
                setDate(new Date(date.getFullYear(), date.getMonth() - 1))
              }
              className="btn btn-link"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="current-month">
              {date.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={() =>
                setDate(new Date(date.getFullYear(), date.getMonth() + 1))
              }
              className="btn btn-link"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <table
        className="calendar-grid"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
          paddingLeft: "5rem",
          paddingRight: "5rem",
        }}
      >
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderCalendarWeeks()}</tbody>
      </table>

      {showNewEventModal && (
        <NewEventModal
          onClose={() => setShowNewEventModal(false)}
          onSave={handleAddEvent}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDelete}
        />
      )}

      {showSyncModal && (
        <GoogleCalendarSync
          onClose={() => setShowSyncModal(false)}
          onSync={handleGoogleSync}
        />
      )}
    </div>
  );
};

export default CalendarView;
