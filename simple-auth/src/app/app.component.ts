import {Component, HostListener} from '@angular/core';
import {NavigationService} from "./shared/services/navigation.service";
import {AppService} from "./shared/services/app.service";
import {Platform} from "@ionic/angular";
import {AuthService} from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'simple-auth';
  public appService: AppService;
  public authService: AuthService;
  public navigationService: NavigationService;
  public platform: Platform;

  constructor(
    appService: AppService,
    authService: AuthService,
    navigationService: NavigationService,
    platform: Platform
  ) {
    this.appService = appService;
    this.authService = authService;
    this.navigationService = navigationService;
    this.platform = platform;

    this.initializeApp();
  }

  async initializeApp() {
    await this.onResize();
    await this.appService.showLoading();
    await this.authService.checkUser((callback: boolean) => {
      if (!callback) {
        this.navigationService.goToUrl('login');
      } else {
        this.navigationService.goToUrl('dashboard');
      }
    });
    await this.appService.hideLoading();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  }
}
