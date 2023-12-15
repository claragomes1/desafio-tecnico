import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileListComponent } from './profile-list.component';
import { ProfileService } from '../../services/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { WeeklyCalendarComponent } from '../weekly-calendar/weekly-calendar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ProfileListComponent', () => {
  let component: ProfileListComponent;
  let fixture: ComponentFixture<ProfileListComponent>;
  let profileService: ProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProfileListComponent,
        ProfileDetailsComponent,
        WeeklyCalendarComponent,
      ],
      providers: [ProfileService],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileListComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch profiles on init', () => {
    const profiles = [{ id: 1, name: 'Name 1' }, { id: 2, name: 'Name 2 2' }];
    spyOn(profileService, 'getProfiles').and.returnValue(of(profiles));

    fixture.detectChanges();

    expect(profileService.getProfiles).toHaveBeenCalled();
    expect(component.profiles).toEqual(profiles);
  });
});
