import {Component, HostListener} from '@angular/core';
import {NavigationService} from "./shared/services/navigation.service";
import {AppService} from "./shared/services/app.service";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'simple-auth';
  public appService: AppService;
  public navigationService: NavigationService;
  public platform: Platform;

  constructor(
    appService: AppService,
    navigationService: NavigationService,
    platform: Platform
  ) {
    this.appService = appService;
    this.navigationService = navigationService;
    this.platform = platform;

    this.initializeApp();
  }

  async initializeApp() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  }
}
