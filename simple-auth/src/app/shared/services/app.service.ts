import {Injectable} from '@angular/core';
import {MenuController, ToastController} from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import {LoadingController} from '@ionic/angular';
import {AppModalService} from './appModal.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  appReady = false;
  toastController: ToastController;
  menu: MenuController;
  loadingController: LoadingController;
  appModalService: AppModalService;
  analytics: AngularFireAnalytics;
  titleService: Title;

  loading: any;
  isLoading = false;
  loadingCounter = 0;
  isShowToolbar = false;
  offline = false;

  pushData: any = null;

  private alertController: AlertController;
  private blockBack = false;
  private alertElement: HTMLIonAlertElement | undefined | null;

  constructor(
    menu: MenuController,
    alertController: AlertController,
    toastController: ToastController,
    loadingController: LoadingController,
    appModalService: AppModalService,
    titleService: Title,
    analytics: AngularFireAnalytics
  ) {

    this.menu = menu;
    this.alertController = alertController;
    this.toastController = toastController;
    this.loadingController = loadingController;
    this.appModalService = appModalService;
    this.analytics = analytics;
    this.titleService = titleService;

  }

  /**
   * WARNING it is important to call it with await flag, otherwise it can be closed before opens
   */
  async showLoading() {
    this.loadingCounter++;

    // if (!this.isLoading && !this.startPage) {
    if (!this.isLoading) {

      this.isLoading = true;

      this.loading = await this.loadingController.create({
        // message: '<ion-img class="loading-spinner" src="/assets/logo-img.svg" alt="loading..."></ion-img>',
        message: '<div class="loading-spinner-container">' +
          '<ion-spinner name="dots"></ion-spinner>' +
          '</div>',
        cssClass: 'loading-container',
        spinner: null,
        translucent: true,
        showBackdrop: false,
        animated: false
      });

      await this.loading.present();
    }
  }

  async hideLoading(all = false) {
    this.loadingCounter--;

    if (all) {
      this.loadingCounter = 0;
    }

    if (this.loadingCounter <= 0) {

      if (this.loading) {
        this.loading.dismiss();
        this.loading = null;
      }

      this.loadingCounter = 0;

      this.isLoading = false;
      return await this.loadingController.dismiss(null, 'cancel');
    }

    return null;
  }

  async showAlert(title: string, desc: string, error: boolean, callback: () => void) {
    this.alertElement = await this.alertController.create({
      header: title,
      message: desc,
      buttons: ['Ok']
    });

    await this.alertElement.present();

    await this.alertElement.onDidDismiss().then((res) => {

      if (callback) {
        callback();
      }

      this.alertElement = null;
    });

  }

  async showTestAlert(text: string, callback: (res: string) => void) {
    this.alertElement = await this.alertController.create({
      buttons: ['Ok'],
      mode: 'ios',
      inputs: [
        {
          type: 'textarea',
          value: text
        },
      ],
    });

    await this.alertElement.present();

    await this.alertElement.onDidDismiss().then((res) => {

      console.log(res.data);

      if (callback) {
        callback(res.data.values[0]);
      }

      this.alertElement = null;
    });

  }

  openMenu() {
    this.menu.open();
  }

  async showToast(
    text: string = '',
    type: 'default' | 'primary' | 'success' | 'danger' = 'default',
    duration = 5000   // to set to infinite: null or 0
  ) {
    const buttons = [
      {
        icon: 'assets/icons/cancel-cross-button.svg',
        role: 'cancel'
      }
    ];


    const toast = await this.toastController.create({
      header: text,
      duration,
      cssClass: `toast-type-${type} app-toast-wrapper`,
      translucent: false,
      position: 'top',
      mode: 'ios',
      buttons,
    });

    await toast.present().then(() => {});

    await toast.onDidDismiss().then(() => {});
  }

  showToolbar() {
    this.isShowToolbar = true;
  }

  hideToolbar() {
    this.isShowToolbar = false;
  }

  getLocalStorage(key: string, defaultValue = null) {

    // if (key === 'token') {
    //   return 'aLYCiDUI64z4cD7bBG8bA1UsTzWsYS9j';
    // }

    const v = localStorage.getItem(key);
    return v ? v : defaultValue;
  }

  setLocalStorage(key: string, value: string | null) {

    if (value === null) {
      return localStorage.removeItem(key);
    } else {
      return localStorage.setItem(key, value);
    }

  }

  async closeToast() {
    try {
      const element = await this.toastController.getTop();
      if (element) {
        element.dismiss();
        return;
      }
    } catch (error) {
    }
  }
}
