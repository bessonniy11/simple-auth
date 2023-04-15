import {Injectable, NgZone} from '@angular/core';
import * as auth from 'firebase/auth';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {User} from "./user";
import {AppService} from "./app.service";
import {NavigationService} from "./navigation.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private appService: AppService,
    private navigationService: NavigationService
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.setUser();
  }

  async setUser() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log('setUser', user);
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  checkUser(callback: any) {
    this.afAuth.authState.subscribe((user) => {
      user ? callback(true) : callback(false);
    });
  }

  checkVerifyEmail(email: any, password: any) {
    this.appService.showLoading();
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // если емейл был подтверждён
        if (result.user?.emailVerified) {
          // обновляется юзер в localStorage
          this.setUser().then(() => {
            // todo тут что-то странное - then выше не успевает отработать
            //  и переход происходит раньше, чем обновится localStorage.
            //  Нужно будет потом решить эту проблему
            setTimeout(() => {
              this.appService.hideLoading();
              this.navigationService.goToUrl('dashboard')
            }, 2000);
          });
        } else {
          this.appService.hideLoading();
          this.appService.showToast('Вам необходимо верифицировать почту', 'danger', 7000);
        }
      })
      .catch((error) => {
        this.appService.hideLoading();
        this.appService.showToast(error.message, 'danger', 7000);
      });
  }

  // Sign in with email/password
  SignIn(email: any, password: any) {
    this.appService.showLoading();
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('result', result);
        this.appService.hideLoading();
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            console.log('user', user);
            this.navigationService.goToUrl('dashboard');
          }
        });
      })
      .catch((error) => {
        this.appService.hideLoading();

        if (error.message.includes('The password is invalid or the user does not have a password')) {
          error.message = 'Неверный логин или пароль';
        } else if(error.message.includes('Access to this account has been temporarily disabled')) {
          error.message = 'Доступ к этой учетной записи был временно отключен из-за множества неудачных попыток входа.' +
            'Вы можете немедленно восстановить его, сбросив пароль, или повторить попытку позже';
        } else if(error.message.includes('is no user record corresponding to this identifier. The user may have been deleted')) {
          error.message = 'Неверный логин или пароль';
        }

        this.appService.showToast(error.message, 'danger', 7000);
      });
  }

  // Sign up with email/password
  SignUp(email: any, password: any) {
    this.appService.showLoading();
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.appService.hideLoading();
        /* Call the SendVerificationMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail(email, password);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        if (error.message.includes('Password should be at least 6 characters')) {
          error.message = 'Пароль должен быть не менее 6 симоволов';
        } else if(error.message.includes('email address is already in use by another account. ')) {
          error.message = 'Этот адрес электронной почты уже используется другой учетной записью';
        }
        this.appService.hideLoading();
        this.appService.showToast(error.message, 'danger');
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail(email?: any, password?: any,) {
    this.appService.showLoading();
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.appService.hideLoading();
        const data = {email: email, password: password};
        this.navigationService.goToUrl('verify-email', {}, data);
      })
      .catch((error) => {
        console.log('error', error);
        this.appService.hideLoading();
        this.appService.showToast(error.message, 'danger');
      });
  }

  // Reset Forgot password
  ForgotPassword(passwordResetEmail: string | null | undefined) {
    this.appService.showLoading();
    return this.afAuth
      .sendPasswordResetEmail(<string>passwordResetEmail)
      .then(() => {
        this.appService.hideLoading();
        this.appService.showToast('Письмо со сбросом пароля отправлено, проверьте свой почтовый ящик', 'success');
      })
      .catch((error) => {
        this.appService.showToast(error.message, 'danger');
      });
  }

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return !!(user !== null && user.emailVerified !== false);
  }

  // Sign in with Google
  GoogleAuth() {
    this.appService.showLoading();
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.appService.hideLoading();
      this.router.navigate(['dashboard']);
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        this.appService.showToast(error.message, 'danger');
      });
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  async SignOut() {
    await this.appService.showLoading();
    this.afAuth.signOut().then(() => {
      this.appService.hideLoading();
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
