import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { format } from 'date-fns';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="events-container">
      <h2>Upcoming Events</h2>
      <div class="event-list">
        @for (event of upcomingEvents; track event._id || $index) {
          <mat-card class="event-card">
            <mat-card-header>
              <mat-card-title>{{ event.title }}</mat-card-title>
              <mat-card-subtitle>
                {{ formatDate(event.dateTime) }}
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ event.description }}</p>
              @if (event.location) {
                <p><strong>Location:</strong> {{ event.location }}</p>
              }
            </mat-card-content>
            <mat-card-actions>
              @if (event._id) {
                <button mat-stroked-button class="delete-btn" (click)="deleteEvent(event._id)">
                  delete
                </button>
              }
            </mat-card-actions>
          </mat-card>
        }
        @if (upcomingEvents.length === 0) {
          <p class="no-events">No upcoming events</p>
        }
      </div>

      <h2>Past Events</h2>
      <div class="event-list">
        @for (event of pastEvents; track event._id || $index) {
          <mat-card class="event-card">
            <mat-card-header>
              <mat-card-title>{{ event.title }}</mat-card-title>
              <mat-card-subtitle>
                {{ formatDate(event.dateTime) }}
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ event.description }}</p>
              @if (event.location) {
                <p><strong>Location:</strong> {{ event.location }}</p>
              }
            </mat-card-content>
            <mat-card-actions>
              @if (event._id) {
                <button mat-stroked-button class="delete-btn" (click)="deleteEvent(event._id)">
                  delete
                </button>
              }
            </mat-card-actions>
          </mat-card>
        }
        @if (pastEvents.length === 0) {
          <p class="no-events">No past events</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .events-container {
      padding: 1rem;
    }
    .event-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .event-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    mat-card-header {
      padding: 16px 16px 0;
    }
    mat-card-content {
      flex-grow: 1;
      padding: 16px;
      margin-bottom: 0;
    }
    mat-card-actions {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .no-events {
      text-align: center;
      color: #666;
      grid-column: 1 / -1;
      padding: 2rem;
    }
    mat-card-title {
      font-size: 18px;
      margin-bottom: 8px;
    }
    mat-card-subtitle {
      margin-bottom: 0;
    }
    .delete-btn {
      color: #f44336;
      border-color: #f44336;
      min-width: 80px;
      padding: 4px 16px;
      height: 36px;
      font-size: 14px;
      border-radius: 4px;
      text-transform: lowercase;
      line-height: 28px;
      margin-right: 8px;
    }
    .delete-btn:hover {
      background-color: rgba(244, 67, 54, 0.04);
    }
  `]
})
export class EventListComponent implements OnInit {
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        const now = new Date();
        const validEvents = events.filter(event => event._id);
        
        this.upcomingEvents = validEvents
          .filter(event => new Date(event.dateTime) >= now)
          .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        
        this.pastEvents = validEvents
          .filter(event => new Date(event.dateTime) < now)
          .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.showSnackBar('Error loading events');
      }
    });
  }

  formatDate(date: Date): string {
    return format(new Date(date), 'MMMM do, yyyy');
  }

  deleteEvent(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.loadEvents();
          this.showSnackBar('Event deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.showSnackBar('Error deleting event: ' + (error.error?.message || 'Unknown error'));
        }
      });
    }
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}