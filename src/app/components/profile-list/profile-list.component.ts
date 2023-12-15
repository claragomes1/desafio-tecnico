import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  profiles: any[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.fetchProfiles();
  }

  fetchProfiles(): void {
    this.profileService.getProfiles()
      .subscribe(profiles => {
        this.profiles = profiles;
      });
  }
}

