import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../shared/services/navigation.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    public authService: AuthService,
    private navigationService: NavigationService,
  ) {
    this.loginForm.valueChanges.subscribe((val) => {
      console.log('val', val);
    });
  }

  ngOnInit() {
  }

  login() {
    this.authService.SignIn(this.loginForm.value.email, this.loginForm.value.password)
  }

  loginWithGoogle() {
    this.authService.GoogleAuth();
  }

  goToUrl(link: string) {
    this.navigationService.goToUrl(link);
  }
}
