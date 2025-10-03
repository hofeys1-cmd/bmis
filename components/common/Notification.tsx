
import React, { useEffect } from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from '../icons/InformationCircleIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

type NotificationType = 'success' | 'error' | 'info';

interface Props {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const ICONS: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <ExclamationTriangleIcon className="h-6 w-6 text-danger-500" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

const TYPE_CLASSES: Record<NotificationType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-danger-50 border-danger-200 text-danger-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};


export const Notification: React.FC<Props> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`flex items-start p-4 rounded-lg shadow-lg border animate-fade-in-right ${TYPE_CLASSES[type]}`}>
      <div className="flex-shrink-0">
        {ICONS[type]}
      </div>
      <div className="ml-3 mr-3 w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="ml-4 mr-4 flex-shrink-0 flex">
        <button
          onClick={onClose}
          className="inline-flex rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
