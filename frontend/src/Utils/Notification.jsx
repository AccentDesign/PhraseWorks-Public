import React, { useEffect, useState } from 'react';
import ee from 'event-emitter';

import Alert from './Alert';

const emitter = new ee();

export const notify = (msg, type = 'default') => {
  emitter.emit('notification', msg, type);
};

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const timeoutsRef = new Map();

    const handleNotification = (msgVal, typeVal) => {
      const newNotification = { id: Date.now(), type: typeVal, msg: msgVal };

      setNotifications((prev) => [...prev, newNotification]);

      const timeoutId = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
        timeoutsRef.delete(newNotification.id);
      }, 10000);

      timeoutsRef.set(newNotification.id, timeoutId);
    };

    emitter.on('notification', handleNotification);

    return () => {
      emitter.off('notification', handleNotification);
      // Clear all active timeouts on unmount
      timeoutsRef.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.clear();
    };
  }, []);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <div className="z-50 fixed bottom-4 right-4 flex flex-col-reverse">
      {notifications.map((notification, idx) => (
        <div
          key={idx}
          className={`relative transition-transform transform translate-y-${idx * 16}`}
        >
          <Alert onClose={() => handleClose(notification.id)} severity={notification.type}>
            {notification.msg}
          </Alert>
        </div>
      ))}
    </div>
  );
}
