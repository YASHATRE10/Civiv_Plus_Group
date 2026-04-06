export type UserRole = 'CITIZEN' | 'ADMIN' | 'OFFICER';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REOPENED';
  location: string;
  submissionDate: string;
  deadline?: string;
  resolvedDate?: string;
  assignedOfficerId?: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  imageUrl?: string;
}

export interface NotificationItem {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  complaintId?: number;
}
