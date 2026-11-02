import React from 'react';
import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'ACTIVE':
    case 'OPEN':
    case 'CONFIRMED':
    case 'APPROVED':
    case 'RESOLVED':
    case 'PUBLISHED':
      return (
        <Badge variant="success" className={className}>
          {status.replace(/_/g, ' ')}
        </Badge>
      );

    case 'PENDING':
    case 'PENDING_VERIFICATION':
    case 'UNDER_REVIEW':
    case 'ASSIGNED':
    case 'IN_PROGRESS':
      return (
        <Badge variant="warning" className={className}>
          {status.replace(/_/g, ' ')}
        </Badge>
      );

    case 'SUSPENDED':
    case 'REJECTED':
    case 'CANCELLED':
    case 'EXPIRED':
      return (
        <Badge variant="danger" className={className}>
          {status.replace(/_/g, ' ')}
        </Badge>
      );

    case 'CLOSED':
    case 'DRAFT':
    case 'COMPLETED':
    case 'ARCHIVED':
      return (
        <Badge variant="secondary" className={className}>
          {status.replace(/_/g, ' ')}
        </Badge>
      );

    case 'LOST':
      return (
        <Badge variant="danger" className={className}>
          LOST
        </Badge>
      );

    case 'FOUND':
      return (
        <Badge variant="info" className={className}>
          FOUND
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
};

