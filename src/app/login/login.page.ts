import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { IonModal, ModalController, NavController } from '@ionic/angular';

import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home.page';
import { User } from '../modelo/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  login_validation_form: FormGroup;
  account_validation_form: FormGroup;
  isModalOpen: Boolean = false;
  currentUser: any;

  constructor(public router: Router, public modalController: ModalController, public formBuilder: FormBuilder,
    public navCtrl: NavController, private authService: FirebaseAuthService, private firebaseService: FireServiceProvider) {
  }

  ngOnInit() {
    this.login_validation_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-ZñáéíóúÁÉÍÓÚ0-9_.+-]+[@]{1}[a-zA-ZÑáéíóúÁÉÍÓÚ0-9-]+[.]{1}[a-zA-Z]+$'),
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.pattern(''),
        Validators.maxLength(32),
        Validators.minLength(8),
        Validators.required
      ]))
    });

    this.account_validation_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZñáéíóúÁÉÍÓÚ]+$'),
        Validators.maxLength(32),
        Validators.minLength(1),
        Validators.required
      ])),
      last_names: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZñáéíóúÁÉÍÓÚ]+$'),
        Validators.maxLength(32),
        Validators.minLength(1),
        Validators.required
      ]))
    });
  }

  async onLogin(values: any) {
    //this.authService.logInUser(values["email"], values["password"]) <--------------------
    this.authService.logInUser("rawkvr@gmail.com", "12345678")
      .then(async (user) => {
        if (this.authService.isEmailVerified(user)) {
          await this.firebaseService.getUser(user.uid).then((data) => {
            this.currentUser = data;
          });
          if (this.currentUser.nombre == "") {
            this.setOpenModal(true);
          } else {
            localStorage.setItem('user.id', this.currentUser.id)
            this.navCtrl.navigateForward('households');
          }
        } else {
          console.log("¡El email no está verificado!");
        }
      }).catch(() => {
        console.log("¡Error!")
      })
  }

  async onLoginGoogle() {
    this.authService.logInUserGoogle().then((user) => {
      if (this.authService.isEmailVerified(user)) {
        this.router.navigate(['households']);
      } else {
        console.log("¡El email no está verificado!");
      }
    }).catch(() => {
      console.log("¡Error!")
    })
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm(values: any) {
    this.currentUser.nombre = values["name"];
    this.currentUser.apellidos = values["last_names"];
    this.setOpenModal(false);
    console.log(this.currentUser);
    this.firebaseService.updateUser(this.currentUser);
    localStorage.setItem('user.id', this.currentUser.id)
    this.navCtrl.navigateForward('home');
  }

  setOpenModal(isOpen: Boolean) {
    this.isModalOpen = isOpen;
  }
}
