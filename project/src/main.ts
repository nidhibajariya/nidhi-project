import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EventFormComponent } from './app/components/event-form/event-form.component';
import { EventListComponent } from './app/components/event-list/event-list.component';
import { Event } from './app/models/event.model';
import { EventService } from './app/services/event.service';
import { provideHttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    EventFormComponent,
    EventListComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Event Reminder App</span>
      <span class="spacer"></span>
      <button mat-button (click)="showForm = !showForm">
        {{ showForm ? 'View Events' : 'Create Event' }}
      </button>
    </mat-toolbar>

    <div class="container">
      @if (showForm) {
        <app-event-form (submitEvent)="handleEventSubmit($event)" />
      } @else {
        <app-event-list />
      }
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class App {
  showForm = false;

  constructor(private eventService: EventService) {}

  handleEventSubmit(event: Event) {
    this.eventService.createEvent(event).subscribe({
      next: () => {
        this.showForm = false;
      },
      error: (error) => {
        console.error('Error creating event:', error);
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ]
});