import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyCalendarComponent } from './weekly-calendar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../services/profile.service';
import { ScheduleService } from '../../services/schedule.service';
import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';

describe('WeeklyCalendarComponent', () => {
  let component: WeeklyCalendarComponent;
  let fixture: ComponentFixture<WeeklyCalendarComponent>;
  let scheduleService: ScheduleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeeklyCalendarComponent],
      providers: [
        ProfileService,
        ScheduleService,
        MatSnackBar
      ],
      imports: [HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyCalendarComponent);
    component = fixture.componentInstance;
    scheduleService = TestBed.inject(ScheduleService);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should fetch profiles and schedules for each profile', fakeAsync(() => {
    const profileService = TestBed.inject(ProfileService);
    const scheduleService = TestBed.inject(ScheduleService);
    const profiles = [{ id: 1 }, { id: 2 }];
    const schedules = [{ dates: [{ date: new Date() }] }];

    spyOn(profileService, 'getProfiles').and.returnValue(of(profiles));
    spyOn(scheduleService, 'getSchedulesByProfileId').and.returnValue(of(schedules));

    component.fetchProfiles();
    tick();

    expect(component.AllScheduledSlots[1]).toBeDefined();
    expect(component.AllScheduledSlots[2]).toBeDefined();
  }));

  it('should check slot availability', () => {
    component.AllScheduledSlots = { 1: [new Date()] };
    const isAvailable = component.isSlotAvailable('Dom', '08:00');
    expect(isAvailable).toBe(false);
  });

  it('should handle slot click and select slot', () => {
    spyOn(component, 'isSlotAvailable').and.returnValue(true);

    component.handleSlotClick('Dom', '08:00');
    expect(component.selectedSlot).toEqual({ day: 'Dom', time: '08:00' });
  });

  it('should book a selected slot', () => {
    spyOn(component, 'isSlotAvailable').and.returnValue(true);
    const snackBarSpy = spyOn(TestBed.inject(MatSnackBar), 'open');

    component.handleSlotClick('Seg', '08:00');
    component.bookSelectedSlot();

    expect(snackBarSpy).toHaveBeenCalledWith('Horário agendado! :)', 'Fechar', jasmine.any(Object));
  });

  it('should cancel booking slot', () => {
    component.selectedSlot = { day: 'Dom', time: '08:00' };
    component.cleanSelectedSlot();
    expect(component.selectedSlot).toEqual({ day: '', time: '' });
  });

  it('should check if a slot is selected', () => {
    component.selectedSlot = { day: 'Dom', time: '08:00' };
    const isSelected = component.isSelectedSlot('Dom', '08:00');
    expect(isSelected).toBe(true);
  });

  it('should get slot date', () => {
    const slotDate = component.getSlotDate('Dom', '08:00');
    expect(slotDate).toBeDefined();
  });

  it('should move to the previous week', () => {
    component.currentWeekStartDate = new Date('2023-12-01');
    component.goBackWeek();
    expect(component.currentWeekStartDate).toEqual(new Date('2023-11-24'));
  });

  it('should move to the next week', () => {
    component.currentWeekStartDate = new Date('2023-12-01');
    component.goNextWeek();
    expect(component.currentWeekStartDate).toEqual(new Date('2023-12-08'));
  });

  it('should check if it is the current week', () => {
    const today = new Date('2023-12-01');

    spyOn<any>(globalThis, 'Date').and.returnValue({ setHours: () => {}, getTime: () => today.getTime() });

    component.currentWeekStartDate = new Date('2023-12-01');
    const isCurrentWeek = component.isCurrentWeek();
    expect(isCurrentWeek).toBe(true);
  });
});
