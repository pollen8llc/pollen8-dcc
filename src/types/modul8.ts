
export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requester_id: string;
  provider_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetails {
  id: string;
  service_request_id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface NegotiationStatus {
  id: string;
  service_request_id: string;
  current_status: string;
  notes?: string;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  service_request_id: string;
  action: string;
  description: string;
  user_id: string;
  created_at: string;
}

export interface CrossPlatformNotification {
  id: string;
  recipient_id: string;
  sender_id: string;
  service_request_id: string;
  notification_type: string;
  title: string;
  message: string;
  platform_context: 'modul8' | 'labr8';
  read_at?: string;
  created_at: string;
}
