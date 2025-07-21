import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import api from '../utils/api';

const EventDetail = () => {
  const { id } = useParams();
  if (!id || id === 'undefined') {
    return <div className="text-center text-red-500 py-10">Invalid event ID.</div>;
  }
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      // If id is a number, treat it as an index into the past events array
      if (!isNaN(Number(id))) {
        try {
          const response = await api.get('/v1/db/past-events');
          const events = response.data.data || [];
          const eventByIndex = events[Number(id)];
          if (eventByIndex) {
            setEvent(eventByIndex);
          } else {
            setError('Event not found.');
          }
        } catch (err) {
          setError('Event not found.');
        } finally {
          setLoading(false);
        }
        return;
      }
      // Otherwise, try fetching by id as before
      try {
        let response = await api.get(`/v1/db/past-events/${id}`);
        setEvent(response.data.data);
      } catch (err) {
        try {
          let response = await api.get(`/v1/db/upcoming-events/${id}`);
          setEvent(response.data.data);
        } catch (err2) {
          setError('Event not found.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!event) return <div className="text-center py-10">No event data found.</div>;

  // Helper to render reference links as clickable
  const renderReferenceLinks = (links) => {
    if (!links) return null;
    const arr = Array.isArray(links) ? links : String(links).split(',');
    return (
      <ul className="list-disc pl-6 space-y-1">
        {arr.map((link, idx) => {
          const url = link.trim();
          if (!url) return null;
          return (
            <li key={idx}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{url}</a>
            </li>
          );
        })}
      </ul>
    );
  };

  // Back button handler
  const handleBack = () => window.history.back();

  return (
    <div className="min-h-screen mt-20 bg-white dark:bg-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mt-8 mb-4 text-blue-700 dark:text-blue-300 hover:underline font-medium px-2 py-1 rounded"
        >
          ← Back
        </button>
        {/* Title, Date, Location */}
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">{event.title}</h1>
        <div className="mb-8 text-gray-700 dark:text-gray-200 text-lg flex flex-wrap gap-8">
          <span>Date: {event.date?.day && event.date?.month ? `${event.date.day} ${event.date.month}` : event.date}</span>
          {(event.location || event.venue) && (
            <span>Location: {event.location || event.venue}</span>
          )}
        </div>
        {/* Main Content Sections */}
        <main className="space-y-10">
          {event.theme && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-blue-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Theme</h2>
              <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line text-lg">{event.theme}</div>
            </section>
          )}
          {event.overview && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-indigo-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Overview</h2>
              <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line text-lg">{event.overview}</div>
            </section>
          )}
          {event.highlights && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-emerald-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Highlights</h2>
              <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line text-lg">{event.highlights}</div>
            </section>
          )}
          {event.body && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Details</h2>
              <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line text-lg">{event.body}</div>
            </section>
          )}
          {event.referenceLinks && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-pink-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Reference Links</h2>
              {renderReferenceLinks(event.referenceLinks)}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventDetail; 