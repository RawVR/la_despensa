import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonMenu, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Household } from '../modelo/household';
import { Pantry } from '../modelo/pantry';
import { User } from '../modelo/user';

@Component({
  selector: 'app-show-household',
  templateUrl: './show-household.page.html',
  styleUrls: ['./show-household.page.scss'],
})
export class ShowHouseholdPage implements OnInit {
  @ViewChild('menu') menu: IonMenu;
  pantry_validation_form: FormGroup;
  user: User;
  household: Household;
  qrCode: string;
  pantries: Pantry[];
  isCreator: Boolean;
  isModalOpen: Boolean;

  constructor(private router: Router, public formBuilder: FormBuilder, private alertCtrl: AlertController,
    private toastController: ToastController, private firebaseService: FireServiceProvider,
    public translate: TranslateService) {
    document.body.setAttribute('color-theme', localStorage.getItem('color-theme'));
    this.user = new User();
    this.household = new Household();
    this.pantries = [];
    this.isCreator = false;
    this.isModalOpen = false;

    let language = localStorage.getItem('language');
    this.translate.setDefaultLang('en');
    if (language) {
      this.translate.use(language);
    }
  }

  ngOnInit() {
    const userID = localStorage.getItem('user.id');
    if (userID) {
      this.firebaseService.getUser(userID).then((data) => {
        this.user = data;
      });
    }

    const householdID = localStorage.getItem('household.id');
    if (householdID) {
      this.firebaseService.getHousehold(householdID).then((data) => {
        this.household = data;
        this.firebaseService.getPantries(householdID).then((data) => {
          this.pantries = [];
          this.pantries = data;
        });
        if (this.household.creator == userID) {
          this.isCreator = true;
        }
      });
    }

    this.pantry_validation_form = this.formBuilder.group({
      description: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zñ A-ZÑáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(64),
        Validators.required
      ])),
      type: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zñ A-ZÑáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.required
      ]))
    });
  }

  async shareHousehold() {
    this.qrCode = this.household.id;
  }

  async deletePantry(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar la despensa',
      message: "¿Está seguro de eliminar la despensa " + this.pantries[index].description + " permanentemente?",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.firebaseService.deletePantry(this.pantries[index].id).then(async (deleted) => {
              if (deleted) {
                const toast = await this.toastController.create({
                  message: 'Despensa ' + this.pantries[index].description + ' eliminada correctamente!',
                  duration: 1500,
                  icon: 'trash'
                });
                await toast.present();
                this.pantries.splice(index, 1);
              } else {
                const toast = await this.toastController.create({
                  message: '¡Error al eliminar la despensa' + this.pantries[index].description + '!',
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

  showPantry(index: number) {
    localStorage.setItem('pantry.id', this.pantries[index].id)
    this.router.navigate(['/show-pantry']);
  }

  newPantry(values: any) {
    let pantry = new Pantry();
    pantry.description = values['description'];
    pantry.type = values['type'];
    pantry.household = this.household.id;
    pantry.foods = [];
    this.pantries.push(pantry);
    this.firebaseService.insertPantry(pantry);
    this.setOpen(false);
    this.pantry_validation_form.reset();
  }

  setOpen(isOpen: Boolean) {
    this.isModalOpen = isOpen;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      if (this.household.id) {
        this.firebaseService.getHousehold(this.household.id).then((data) => {
          this.household = data;

          if (this.household.creator == this.user.id) {
            this.isCreator = true;
          }
        });
      }
      event.target.complete();
    }, 2000);
  };
}
