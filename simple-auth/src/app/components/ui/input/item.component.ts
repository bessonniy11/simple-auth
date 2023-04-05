import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-input',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class InputComponent implements OnInit {
  @Input() label: string = '';
  @Input() control = new FormControl();
  @Input() inputId: string = '';
  @Input() type: string = 'text';
  @Input() password= false;
  @Input() autofocus = false;
  @Input() required = false;
  @Input() readonly = false;

  errorMessages: Record<string, string> = {
    required: "Это поле обязательное",
    email: "Проверьте емейл",
  };

  constructor(
  ) { }

  ngOnInit() {
  }

  hideShowPass() {
    if (this.type === 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
