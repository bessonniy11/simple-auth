import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  gorGotForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }
}
