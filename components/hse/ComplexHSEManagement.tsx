import React from 'react';
import type { User } from '../../types';
import { HSEManagement } from './HSEManagement';

interface Props {
  user: User;
}

export const ComplexHSEManagement: React.FC<Props> = ({ user }) => {
  // The user prop is now passed to HSEManagement to enable role-based access.
  return <HSEManagement user={user} />;
};
