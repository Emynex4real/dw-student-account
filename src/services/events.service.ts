import api from './api';

const EVENT_IMAGE_BASE = 'https://admin.digitalworldtech.academy/uploads/events/';

export interface Event {
  id: number;
  name: string;
  image: string;
  category: string;
  status: number;
  status_label: 'happening' | 'upcoming' | 'expired';
  date: string;
  description: string;
  host: string;
  number: string;
  email: string;
  address: string;
  capacity: number;
}

export function getEventImageUrl(filename: string): string {
  return filename ? EVENT_IMAGE_BASE + filename : '';
}

export async function getEvents(): Promise<Event[]> {
  const { data } = await api.get<{ events: Event[] }>('/events');
  return data.events;
}
