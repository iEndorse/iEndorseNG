import React from 'react';
import { Link } from 'react-router-dom';
import dot from '../svg/dot.svg';
import send from '../svg/send.svg';
import EndorsementCard from './EndorsementCard';

interface EndorsementsListProps {
  endorsements: any[];
}

const NotificationsList: React.FC<EndorsementsListProps> = ({ endorsements }) => {
  return (
    <div>
      {endorsements.map((item) => (
        <EndorsementCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default NotificationsList;
