import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatNativeDateModule
  ],
  template: `
    <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" required>
        <mat-error *ngIf="eventForm.get('title')?.errors?.['required'] && eventForm.get('title')?.touched">
          Title is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" rows="3"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Date & Time</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="dateTime" required>
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        <mat-error *ngIf="eventForm.get('dateTime')?.hasError('required')">
          Date & Time is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Location</mat-label>
        <input matInput formControlName="location">
      </mat-form-field>

      <mat-checkbox formControlName="reminder" color="primary">
        Set Reminder
      </mat-checkbox>

      <div class="button-group">
        <button mat-raised-button color="primary" type="submit" [disabled]="!eventForm.valid">
          {{ event ? 'Update' : 'Create' }} Event
        </button>
      </div>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 500px;
      margin: 0 auto;
      padding: 1rem;
    }
    .button-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
    textarea {
      min-height: 100px;
    }
  `]
})
export class EventFormComponent {
  @Input() event?: Event;
  @Output() submitEvent = new EventEmitter<Event>();

  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      dateTime: [new Date(), [Validators.required]],
      location: [''],
      reminder: [false]
    });
  }

  ngOnInit() {
    if (this.event) {
      this.eventForm.patchValue(this.event);
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const eventData: Event = {
        ...this.eventForm.value,
        createdAt: this.event?.createdAt || new Date(),
        dateTime: new Date(this.eventForm.value.dateTime) // Ensure dateTime is a Date object
      };
      this.submitEvent.emit(eventData);
      this.eventForm.reset({
        dateTime: new Date(),
        reminder: false
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}