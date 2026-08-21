import { authRequest } from './auth';

export type AlertType = 'CUTREMUR' | 'INUNDATIE' | 'INCENDIU' | 'METEO_EXTREM' | 'ALTA';
export type AlertSeverity = 'INFORMARE' | 'ATENTIONARE' | 'PERICOL';
export type AlertStatus = 'ACTIVE' | 'ENDED';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  zones: string[];
  startsAt: string;
  endsAt: string;
  status: AlertStatus;
  createdBy: string;
  endedAt: string | null;
}

export interface AlertStats {
  alertId: string;
  totalCheckins: number;
  eligibleUsers: number;
  rate: number;
  checkins: {
    userId: string;
    email: string | null;
    clientTimestamp: string;
    createdAt: string;
  }[];
}

export interface CreateAlertPayload {
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  zones: string[];
  endsAt: string;
}

export function fetchAlerts(): Promise<Alert[]> {
  return authRequest<Alert[]>('/alerts');
}

export function createAlert(payload: CreateAlertPayload): Promise<Alert> {
  return authRequest<Alert>('/alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function endAlert(id: string): Promise<Alert> {
  return authRequest<Alert>(`/alerts/${id}/end`, { method: 'PATCH' });
}

export function fetchAlertStats(id: string): Promise<AlertStats> {
  return authRequest<AlertStats>(`/alerts/${id}/checkins`);
}