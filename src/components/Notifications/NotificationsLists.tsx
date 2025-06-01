import React from 'react';
import NotificationCard from './NotificationCard';

interface NotificationsListProps {
  otherNotifications: any[];
}

const NotificationsList: React.FC<NotificationsListProps> = ({ otherNotifications }) => {
  return (
    <div>
      {otherNotifications.map((item) => (
        <NotificationCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default NotificationsList;
