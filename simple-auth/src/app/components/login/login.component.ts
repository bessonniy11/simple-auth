import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('userName') userName!: ElementRef;
  @ViewChild('userPassword') userPassword!: ElementRef;
  constructor(
    public authService: AuthService
  ) { }
  ngOnInit() { }

  checkUsernameInput(value: HTMLElement) {
    console.log('checkUsernameInput', value);
  }

  checkPasswordInput(value: string) {
    console.log('checkPasswordInput', value);
  }
}
