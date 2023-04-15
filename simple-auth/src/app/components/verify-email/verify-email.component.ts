import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {NavigationService} from "../../shared/services/navigation.service";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private navigationService: NavigationService
  ) { }
  ngOnInit() {
    console.log('data', this.navigationService.data);
  }

  goToUrl(link: string) {
    this.navigationService.goToUrl(link);
  }

  login() {
    this.authService.checkVerifyEmail(this.navigationService.data['email'], this.navigationService.data['password']);
  }
}
