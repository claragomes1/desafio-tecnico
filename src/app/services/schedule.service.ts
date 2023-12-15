import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:3001/schedules';

  constructor(private http: HttpClient) {}

  getSchedulesByProfileId(profileId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?profileId=${profileId}`);
  }

  updateScheduleForProfile(profileId: number, updatedDates: any[]): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${profileId}`, { dates: updatedDates });
  }

}
