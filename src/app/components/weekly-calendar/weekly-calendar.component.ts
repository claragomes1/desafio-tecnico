import { Component, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ScheduleService } from '../../services/schedule.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css']
})
export class WeeklyCalendarComponent {
  @Input() profileId: number = 0;
  weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  timeSlots: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];
  currentDate: Date = new Date();
  currentWeekStartDate: Date = new Date();
  AllScheduledSlots: { [key: number]: Date[] } = {};
  selectedSlot: { day: string, time: string } = { day: '', time: '' };  

  constructor(
    private profileService: ProfileService,
    private scheduleService: ScheduleService,
    private snackBar: MatSnackBar
  ) {
    this.fetchProfiles();
  }

  async fetchProfiles(): Promise<void> {
    try {
      const profilesResponse = await this.profileService.getProfiles().toPromise();

      if (profilesResponse) {
        const profiles: any[] = profilesResponse as any[];
        
        for (const profile of profiles) {
          await this.fetchSchedulesForProfile(profile.id);
        }
      } 
    } catch (error) {
      console.log(error);
    }
  }

  async fetchSchedulesForProfile(profileId: number): Promise<void> {
    try {
      const schedulesResponse = await this.scheduleService.getSchedulesByProfileId(profileId).toPromise();
  
      if (schedulesResponse) {
        const schedules: any[] = schedulesResponse as any[];
  
        const scheduledSlots: Date[] = [];
        for (const slot of schedules) {
          if (slot.dates) {
            for (const dateObj of slot.dates) {
              const date = new Date(dateObj.date);
              scheduledSlots.push(date);
            }
          }
        }
        this.AllScheduledSlots[profileId] = scheduledSlots;
      } 
    } catch (error) {
      console.log(error);
    }
  }  

  isSlotAvailable(day: string, time: string): boolean {
    if (!this.AllScheduledSlots[this.profileId]) {
      return false;
    }
    const slotDate = this.getSlotDate(day, time);  
    const isSlotBooked = this.AllScheduledSlots[this.profileId].some((slotObj: any) =>  {
      new Date(slotObj.date)
      return slotObj.getTime() === slotDate.getTime();
    });  
    return !isSlotBooked;
  }

  handleSlotClick(day: string, time: string): void {
    if (this.isSlotAvailable(day, time)) {
      this.selectedSlot = { day, time };      
    }
  }

  bookSelectedSlot(): void {
    const { day, time } = this.selectedSlot;
    if (day && time) {
      this.addDateToProfile(day, time);
      this.selectedSlot = { day: '', time: '' };

      const config: MatSnackBarConfig = {
        duration: 3000,
        panelClass: ['custom-snackbar'],
      };  
      this.snackBar.open('Horário agendado! :)', 'Fechar', config);      
    }
  }

  addDateToProfile(day: string, time: string): void {
    const slotDate = this.getSlotDate(day, time);
    const date = slotDate.toISOString();
    const newDate = { date: date };
  
    this.scheduleService.getSchedulesByProfileId(this.profileId)
      .subscribe(
        (schedules: any[]) => {
          const schedule = schedules.find(schedule => schedule.profileId === this.profileId);
  
          if (schedule) {
            schedule.dates.push(newDate);
            this.scheduleService.updateScheduleForProfile(this.profileId, schedule.dates)
              .subscribe(
                (response) => {
                  this.fetchSchedulesForProfile(this.profileId);
                },
                (error) => {
                  console.error('Erro ao atualizar datas do agendamento:', error);
                }
              );
          } else {
            console.error('Perfil não encontrado para agendar.');
          }
        },
        (error) => {
          console.error('Erro ao obter o agendamento do perfil:', error);
        }
      );
  }

  cancelBookSlot() {
    this.selectedSlot = { day: '', time: '' };
  }
  
  isSelected(day: string, time: string): boolean {
    return this.selectedSlot.day === day && this.selectedSlot.time === time;
  }

  getSlotDate(day: string, time: string): Date {
    const currentWeekDayIndex = this.weekDays.indexOf(day);
    const slotDate = new Date(this.currentWeekStartDate);
    slotDate.setDate(this.currentWeekStartDate.getDate() + currentWeekDayIndex);
    const [hours, minutes] = time.split(':');
    slotDate.setHours(Number(hours), Number(minutes), 0, 0);
    return slotDate;
  }

  getDatesForWeek(startDate: Date): string[] {
    const nextSevenDays = [];
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + i);
        const dayName = this.weekDays[nextDate.getDay()];
        const formattedDate = `${nextDate.getDate()} ${nextDate.toLocaleString('default', { month: 'short' })}`;
        nextSevenDays.push(`${dayName}\n${formattedDate}`);
    }
    return nextSevenDays;
  }

  goBack(): void {
    const newDate = new Date(this.currentWeekStartDate);
    newDate.setDate(this.currentWeekStartDate.getDate() - 7);
    this.currentWeekStartDate = newDate;
    this.currentDate = new Date(this.currentWeekStartDate);
  }

  goNext(): void {
    const newDate = new Date(this.currentWeekStartDate);
    newDate.setDate(this.currentWeekStartDate.getDate() + 7);
    this.currentWeekStartDate = newDate;
    this.currentDate = new Date(this.currentWeekStartDate);
  }

  isCurrentWeek(): boolean {
    const today = new Date().setHours(0, 0, 0, 0);
    const weekStart = new Date(this.currentWeekStartDate).setHours(0, 0, 0, 0);
    return today === weekStart;
  }
}
