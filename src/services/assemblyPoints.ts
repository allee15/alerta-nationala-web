import { authRequest } from './auth';

export interface AssemblyPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  zone: string;
  capacity: number | null;
  isActive: boolean;
}

export interface CreateAssemblyPointPayload {
  name: string;
  address: string;
  lat: number;
  lng: number;
  zone: string;
  capacity?: number;
}

export type UpdateAssemblyPointPayload = Partial<CreateAssemblyPointPayload>;

export function fetchAssemblyPoints(): Promise<AssemblyPoint[]> {
  return authRequest<AssemblyPoint[]>('/assembly-points');
}

export function createAssemblyPoint(
  payload: CreateAssemblyPointPayload,
): Promise<AssemblyPoint> {
  return authRequest<AssemblyPoint>('/assembly-points', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAssemblyPoint(
  id: string,
  payload: UpdateAssemblyPointPayload,
): Promise<AssemblyPoint> {
  return authRequest<AssemblyPoint>(`/assembly-points/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function setAssemblyPointActive(id: string, isActive: boolean): Promise<AssemblyPoint> {
  return authRequest<AssemblyPoint>(
    `/assembly-points/${id}/${isActive ? 'activate' : 'deactivate'}`,
    { method: 'PATCH' },
  );
}