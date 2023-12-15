import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileService } from './services/profile.service';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ProfileListComponent
      ],
      providers: [
        ProfileService,
      ],
      imports: [
        HttpClientModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
