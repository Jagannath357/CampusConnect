import { v4 as uuidv4 } from 'uuid';

export const generateTrackingTicket = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `GRV-${year}-${randomPart}`;
};

export const generateRegistrationToken = (eventId: string, studentId: string): string => {
  const shortEvent = eventId.slice(-4).toUpperCase();
  const shortStudent = studentId.slice(-4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EVT-${shortEvent}-${shortStudent}-${random}`;
};
