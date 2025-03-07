import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventDto } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3002/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: CreateEventDto): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}