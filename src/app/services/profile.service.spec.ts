import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve profiles via GET method', () => {
    const mockProfiles = [
      { id: 1, name: 'Name 1' },
      { id: 2, name: 'Name 2' }
    ];

    service.getProfiles().subscribe(profiles => {
      expect(profiles.length).toBe(2);
      expect(profiles).toEqual(mockProfiles);
    });

    const req = httpMock.expectOne('http://localhost:3000/profiles');
    expect(req.request.method).toBe('GET');

    req.flush(mockProfiles);
  });
});
