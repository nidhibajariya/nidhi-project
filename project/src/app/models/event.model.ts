export interface Event {
  _id: string;
  title: string;
  description: string;
  dateTime: Date;
  location?: string;
  reminder?: boolean;
  createdAt: Date;
}

export interface CreateEventDto {
  title: string;
  description: string;
  dateTime: Date;
  location?: string;
  reminder?: boolean;
}