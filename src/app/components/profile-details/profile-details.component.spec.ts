import { ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { ProfileDetailsComponent } from './profile-details.component';
import { WeeklyCalendarComponent } from '../weekly-calendar/weekly-calendar.component';
import { ProfileService } from '../../services/profile.service';
import { HttpClientModule } from '@angular/common/http'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DebugElement } from '@angular/core';



describe('ProfileDetailsComponent', () => {
  let component: ProfileDetailsComponent;
  let fixture: ComponentFixture<ProfileDetailsComponent>;
  let profileDe: DebugElement;
  let profileEl: HTMLElement;

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileDetailsComponent,
        WeeklyCalendarComponent,
      ],
      providers: [ProfileService],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDetailsComponent);
    component = fixture.componentInstance;
    profileDe = fixture.debugElement;
    profileEl = profileDe.nativeElement;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display profile details correctly', () => {
    const profileData = {
      id: 1,
      picture: 'picture.jpg',
      name: 'Name 1',
      profession: 'Psicologist',
      ratings: 'rating-image.jpg',
      price: 50,
      description: 'Profile description'
    };

    component.profile = profileData;
    fixture.detectChanges();

    const profileName = profileEl.querySelector('.profile-name');
    expect(profileName).toBeTruthy();
    expect(profileName!.textContent).toContain('Name 1');

    const profileProfession = profileEl.querySelector('.profile-profession');
    expect(profileProfession).toBeTruthy();
    expect(profileProfession!.textContent).toContain('Psicologist');

    const profileDescription = profileEl.querySelector('.profile-description');
    expect(profileDescription).toBeTruthy();
    expect(profileDescription!.textContent).toContain('Profile description');    
  });
});
