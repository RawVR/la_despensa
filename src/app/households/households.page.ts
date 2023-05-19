import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { NavController, IonModal, AlertController, ToastController, MenuController } from '@ionic/angular';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Household } from '../modelo/household';
import { User } from '../modelo/user';
import { exists } from 'fs';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';

@Component({
  selector: 'app-households',
  templateUrl: './households.page.html',
  styleUrls: ['./households.page.scss'],
})
export class HouseholdsPage implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal: IonModal;
  household_validation_form: FormGroup;
  isModalOpen: Boolean;
  isCreator: Boolean;
  scanningQR: Boolean;
  user: User;
  households: Household[];


  constructor(private router: Router, private alertCtrl: AlertController, private navCtrl: NavController,
    public formBuilder: FormBuilder, private firebaseService: FireServiceProvider, private toastController: ToastController,
    angularQRModule: QRCodeModule, public translate: TranslateService, private menuCtrl: MenuController) {
    this.user = new User();
    this.isModalOpen = false;
    this.scanningQR = false;

    let language = localStorage.getItem('language');
    this.translate.setDefaultLang('en');
    if (language) {
      this.translate.use(language);
    }
  }

  ngOnInit() {
    this.menuCtrl.enable(true, 'households-content');
    setTimeout(() => {
      const userID = localStorage.getItem('user.id');
      if (userID) {
        this.firebaseService.getUser(userID).then((data) => {
          this.user = data;
          this.firebaseService.getHouseholds(userID).then((data) => {
            this.households = [];
            this.households = data;
          });
        });
      }
    }, 1000);


    this.household_validation_form = this.formBuilder.group({
      description: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(64),
        Validators.required
      ]))
    });

    this.isCreator = false;
  }

  ngOnDestroy(): void {
    if (this.scanningQR) {
      this.stopScan();
    }
  }

  newHousehold(values: any) {
    let household = new Household();
    household.creator = this.user.id;
    household.users = [];
    household.users.push(this.user.id);
    household.description = values['description'];
    household.pantries = [];
    this.firebaseService.insertHousehold(household);
    this.setOpen(false);
    this.firebaseService.getHouseholds(this.user.id).then((data) => {
      this.households = [];
      this.households = data;
    });
    this.household_validation_form.reset();
  }

  async deleteHousehold(index: number) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('DELETE_HOUSEHOLD_HEADER'),
      message: this.translate.instant('DELETE_HOUSEHOLD_MESSAGE') + this.households[index].description + '?',
      buttons: [
        {
          text: this.translate.instant('DELETE_HOUSEHOLD_BUTTON_CANCEL'),
          handler: () => {
          }
        },
        {
          text: this.translate.instant('DELETE_HOUSEHOLD_BUTTON_DELETE'),
          handler: () => {
            this.firebaseService.deleteHousehold(this.user.id, this.households[index].id)
              .then(async (deleted) => {
                if (deleted) {
                  const toast = await this.toastController.create({
                    message: this.translate.instant('DELETE_HOUSEHOLD_DELETE_TOAST_MESSAGE1') + this.households[index].description +
                      this.translate.instant('DELETE_HOUSEHOLD_DELETE_TOAST_MESSAGE2'),
                    duration: 1500,
                    icon: 'trash'
                  });
                  await toast.present();
                  this.households.splice(index, 1);
                } else {
                  const toast = await this.toastController.create({
                    message: this.translate.instant('DELETE_HOUSEHOLD_ERROR_TOAST_MESSAGE') + this.households[index].description + '!',
                    duration: 1500,
                    icon: 'trash'
                  });
                  await toast.present();
                }
              });
          }
        }
      ]
    });
    await alert.present();
  }

  async linkHousehold() {
    try {
      this.scanningQR = true;
      this.startScan();
    } catch (error) {
      const toast = await this.toastController.create({
        message: this.translate.instant('LINK_HOUSEHOLD_ERROR_TOAST_MESSAGE') + error,
        duration: 5000,
        icon: 'qr-code'
      });
      await toast.present();
    }
  }

  async unlinkHousehold(index: number) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('UNLINK_HOUSEHOLD_HEADER'),
      message: this.translate.instant('UNLINK_HOUSEHOLD_MESSAGE') + this.households[index].description + "?",
      buttons: [
        {
          text: this.translate.instant('UNLINK_HOUSEHOLD_BUTTON_CANCEL'),
          handler: () => {
          }
        },
        {
          text: this.translate.instant('UNLINK_HOUSEHOLD_BUTTON_UNLINK'),
          handler: () => {
            this.firebaseService.unlinkHousehold(this.user.id, this.households[index].id)
              .then(async (unlinked) => {
                if (unlinked) {
                  const toast = await this.toastController.create({
                    message: this.translate.instant('UNLINK_HOUSEHOLD_DELETE_TOAST_MESSAGE1') + this.households[index].description +
                      this.translate.instant('UNLINK_HOUSEHOLD_DELETE_TOAST_MESSAGE2'),
                    duration: 1500,
                    icon: 'qr-code'
                  });
                  await toast.present();
                  this.households.splice(index, 1);
                } else {
                  const toast = await this.toastController.create({
                    message: this.translate.instant('UNLINK_HOUSEHOLD_ERROR_TOAST_MESSAGE') + this.households[index].description + '!',
                    duration: 1500,
                    icon: 'qr-code'
                  });
                  await toast.present();
                }
              });
          }
        }
      ]
    });
    await alert.present();
  }

  setOpen(isOpen: Boolean) {
    this.isModalOpen = isOpen;
  }

  showHousehold(index: number) {
    localStorage.setItem('household.id', this.households[index].id);
    this.router.navigate(['/show-household']);
  }

  showCategoryFoods() {
    this.router.navigate(['/category-foods']);
  }

  async checkPermission() {
    const status = await BarcodeScanner.checkPermission({ force: false });

    if (status.granted) {
      return true;
    }
    if (status.denied || status.neverAsked) {
      const c = confirm(this.translate.instant('CHECK_PERMISSION'));
      this.scanningQR = false;
      if (c) {
        BarcodeScanner.openAppSettings();
      } else {
        return false;
      }
    }
    if (status.restricted || status.unknown) {
      this.scanningQR = false;
      return false;
    }

    const statusRequest = await BarcodeScanner.checkPermission({ force: true });
    if (statusRequest.granted) {
      return true;
    }
    this.scanningQR = false;
    return false;
  };

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      const body = document.querySelector('body');
      if (body) {
        body.classList.add('scanner-active');
      }
      const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });
      if (result?.hasContent) {
        const toast = await this.toastController.create({
          message: this.translate.instant('QR') + result.content,
          duration: 1500,
          icon: 'qr-code'
        });
        await toast.present();

        BarcodeScanner.showBackground();
        const body = document.querySelector('body');
        if (body) {
          body.classList.remove('scanner-active');
          this.scanningQR = false;
        }
      } else {
        const toast = await this.toastController.create({
          message: this.translate.instant('CHECK_PERMISSION'),
          duration: 1500,
          icon: 'qr-code'
        });
        await toast.present();
      }
    } catch (error) {
      const toast = await this.toastController.create({
        message: this.translate.instant('SCAN_ERROR'),
        duration: 1500,
        icon: 'qr-code'
      });
      await toast.present();
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    const body = document.querySelector('body');
    if (body) {
      body.classList.remove('scanner-active');
    }
    this.scanningQR = false;
  };

  handleRefresh(event: any) {
    setTimeout(() => {
      this.firebaseService.getHouseholds(this.user.id).then((data) => {
        this.households = [];
        this.households = data;
      });
      event.target.complete();
    }, 2000);
  };
}
