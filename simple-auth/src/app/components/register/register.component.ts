import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../shared/services/navigation.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordConfirm: new FormControl('', [Validators.required]),
  });

  constructor(
    public authService: AuthService,
    private navigationService: NavigationService
) { }
  ngOnInit() { }

  checkUserEmailInput(userEmail: HTMLInputElement) {

  }

  checkUserPwdInput(userPwd: HTMLInputElement) {

  }

  register() {
    this.authService.SignUp(this.registerForm.value.email, this.registerForm.value.password)
  }

  goToUrl(link: string) {
    this.navigationService.goToUrl(link);
  }
}
