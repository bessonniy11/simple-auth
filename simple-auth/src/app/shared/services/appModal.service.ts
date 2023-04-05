import {Injectable} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {ModalOptions} from '@ionic/core';


@Injectable({
  providedIn: 'root',
})
export class AppModalService {

  modalController: ModalController;
  modalOpening = false;
  submenuShow = false;

  constructor(
    modalController: ModalController
  ) {
    this.modalController = modalController;
  }

  getModalSize(size: string) {
    const map = {
      small: 0.25,
      half: 0.5,
      big: 0.75,
      full: 0.95,
    };

    // @ts-ignore
    return map[size];
  }

  async openModal(
    component: any,
    data: any = null,
    maxSize: 'small' | 'half' | 'big' | 'full' = 'full',
    initialSize: 'small' | 'half' | 'big' | 'full' = 'full',
    callback: (data: any) => void) {

    const breakpoints = [0];

    if (maxSize === 'small') {
      breakpoints.push(this.getModalSize('small'));
    }

    if (maxSize === 'half') {
      breakpoints.push(this.getModalSize('small'));
      breakpoints.push(this.getModalSize('half'));
    }

    if (maxSize === 'big') {
      breakpoints.push(this.getModalSize('small'));
      breakpoints.push(this.getModalSize('half'));
      breakpoints.push(this.getModalSize('big'));
    }

    if (maxSize === 'full') {
      breakpoints.push(this.getModalSize('small'));
      breakpoints.push(this.getModalSize('half'));
      breakpoints.push(this.getModalSize('big'));
      breakpoints.push(this.getModalSize('full'));
    }

    // for (let i = 0.01; i <= 0.95; i += 0.05) {
    //   breakpoints.push(i);
    // }
    //
    // console.log(breakpoints);

    const initialBreakpoint = this.getModalSize(initialSize);

    return await this.makeOpenModal({
      component,
      componentProps: data,
      cssClass: `modal-max-size-${maxSize}`,
      // presentingElement: document.querySelector('.ion-page'),
      initialBreakpoint,
      breakpoints,
      mode: 'md'
    }, callback);

  }


  async makeOpenModal(options: ModalOptions, callback: (data: any) => void) {

    if (this.modalOpening) {
      return null;
    }

    this.modalOpening = true;
    const modal = await this.modalController.create(options);

    await modal.present();

    this.modalOpening = false;

    if (!window.history.state.modal) {
      const modalState = {modal: true};
      history.pushState(modalState, '');
    }

    await modal.onDidDismiss().then((res) => {
      this.submenuShow = false;
      if (/*res.data && */callback) {
        callback(res.data);
      }
    });

    return modal;
  }

  async preloadModals(components: unknown[] = []) {
    for (const component of components) {
      await this.preloadModal(component);
    }
  }

  async preloadModal(component: any) {
    const tempModal = await this.modalController.create({
      animated: false, // this should prevent it from being visible
      swipeToClose: false, // disable interaction to prevent unexpected behavior
      backdropDismiss: false, // disable interaction to prevent unexpected behavior
      showBackdrop: false, // minimize changes to UI
      keyboardClose: false, // minimize side-effects
      component, // Your custom modal component likely won't render, be sure to preload any related assets inside the index.html <head> tags
      componentProps: {},
      cssClass: 'hide'
    });
    await tempModal.present();
    await tempModal.dismiss();
  }

  async closeTopModal() {
    try {
      const element = await this.modalController.getTop();
      if (element) {
        element.dismiss();
        this.submenuShow = false;
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
