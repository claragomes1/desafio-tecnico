import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ScheduleService } from './schedule.service';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ScheduleService]
    });
    service = TestBed.inject(ScheduleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve schedules by profile ID via GET method', () => {
    const profileId = 1;
    const mockSchedules = [
      { id: 1, profileId: 1, dates: ['2023-12-20T12:00:00.000Z', '2023-12-21T12:00:00.000Z'] }
    ];

    service.getSchedulesByProfileId(profileId).subscribe(schedules => {
      expect(schedules.length).toBe(1);
      expect(schedules).toEqual(mockSchedules);
    });

    const req = httpMock.expectOne(`http://localhost:3001/schedules?profileId=${profileId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockSchedules);
  });

  it('should update schedule for profile via PATCH method', () => {
    const profileId = 1;
    const updatedDates = [{ date: '2023-12-20T12:00:00.000Z' }];

    service.updateScheduleForProfile(profileId, updatedDates).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:3001/schedules/${profileId}`);
    expect(req.request.method).toBe('PATCH');

    req.flush({});
  });
});
