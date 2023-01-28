import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { User } from '../modelo/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  register_validation_form: FormGroup;
  usuario: User;

  constructor(public router: Router, private authService: FirebaseAuthService, public formBuilder: FormBuilder,
    public modalCtrl: ModalController, public firebaseService: FireServiceProvider) {
  }

  ngOnInit() {
    this.register_validation_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ0-9_.+-]+[@]{1}[a-zA-ZáéíóúÁÉÍÓÚ0-9-]+[.]{1}[a-zA-Z]+$'),
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.pattern(''),
        Validators.maxLength(32),
        Validators.minLength(8),
        Validators.required
      ]))
    });
  }

  async onRegister(values: any) {
    try {
      await this.authService.signUp(values["email"], values["password"])
        .then(() => {
          this.router.navigate(['login']);
        }).catch(() => {
          console.log("¡Error!")
        })
    } catch (error) {
      throw (error);
    }
  }
}