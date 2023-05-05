import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { IonModal, ModalController, NavController, ToastController } from '@ionic/angular';

import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home.page';
import { User } from '../modelo/user';
import { TranslateService } from '@ngx-translate/core';

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
    private toastController: ToastController, public navCtrl: NavController, private authService: FirebaseAuthService,
    private firebaseService: FireServiceProvider, public translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('en');
    let language = window.navigator.language.substring(0, 2);
    if (language != "es" && language != "en") {
      language = 'en';
    }
    if (localStorage.getItem('language')) {
      let language = localStorage.getItem('language');
      if (language){
        this.translate.use(language);
      }
    } else {
      localStorage.setItem('language', language);
      this.translate.use(language);
    }
  }

  ngOnInit() {
    this.login_validation_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zñA-ZÑáéíóúÁÉÍÓÚ0-9_.+-]+[@]{1}[a-zñA-ZÑáéíóúÁÉÍÓÚ0-9-]+[.]{1}[a-zA-Z]+$'),
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
        Validators.pattern('^[a-zñ A-ZÑáéíóúÁÉÍÓÚ]+$'),
        Validators.maxLength(32),
        Validators.minLength(1),
        Validators.required
      ])),
      last_names: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zñ A-ZÑáéíóúÁÉÍÓÚ]+$'),
        Validators.maxLength(32),
        Validators.minLength(1),
        Validators.required
      ]))
    });
  }

  async onLogin(values: any) {
    this.authService.logInUser(values["email"], values["password"])
    //this.authService.logInUser("rawkvr@gmail.com", "12345678")
      .then(async (user) => {
        if (this.authService.isEmailVerified(user)) {
          await this.firebaseService.getUser(user.uid).then((data) => {
            this.currentUser = data;
          });
          if (this.currentUser.first_name == "") {
            this.setOpenModal(true);
          } else {
            localStorage.setItem('user.id', this.currentUser.id);
            this.navCtrl.navigateForward('households');
          }
        } else {
          const toast = await this.toastController.create({
            message: this.translate.instant('EMAIL_ERROR_VERIFICATION'),
            duration: 1500,
            icon: 'qr-code'
          });
          await toast.present();
        }
      }).catch(() => {
        console.log("¡Error!")
      })
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm(values: any) {
    this.currentUser.first_name = values["first_name"];
    this.currentUser.last_names = values["last_names"];
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
