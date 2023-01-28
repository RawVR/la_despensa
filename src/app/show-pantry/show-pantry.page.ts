import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { MenuController, ToastController } from '@ionic/angular';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Food } from '../modelo/food';
import { Household } from '../modelo/household';
import { Pantry } from '../modelo/pantry';
import { User } from '../modelo/user';

@Component({
  selector: 'app-show-pantry',
  templateUrl: './show-pantry.page.html',
  styleUrls: ['./show-pantry.page.scss'],
})
export class ShowPantryPage implements OnInit, OnDestroy {
  food_validation_form: FormGroup;
  addFood_validation_form: FormGroup;
  user: User;
  household: Household;
  pantry: Pantry;
  foodCategories: string[];
  selectedFood: string;
  expirationFood: string;
  typeModal: string;
  isModalOpen: Boolean;
  isCreator: Boolean;
  scanningBarcode: Boolean;

  constructor(private toastController: ToastController, private menuCtrl: MenuController,
    public formBuilder: FormBuilder, private firebaseService: FireServiceProvider) {
    this.user = new User();
    this.household = new Household();
    this.pantry = new Pantry();
    this.foodCategories = [];
    this.typeModal = "";
    this.isModalOpen = false;
    this.isCreator = false;
    this.scanningBarcode = false;
  }

  ngOnInit() {
    const userID = localStorage.getItem('user.id');
    const householdID = localStorage.getItem('household.id');
    const PantryID = localStorage.getItem('pantry.id');

    if (userID) {
      this.firebaseService.getUser(userID).then((data) => {
        this.user = data;
        if (householdID) {
          this.firebaseService.getHousehold(householdID).then((data) => {
            this.household = data;
            if (this.household.creator == userID) {
              this.isCreator = true;
            }
          });
          if (PantryID) {
            this.firebaseService.getPantry(PantryID).then((data) => {
              this.pantry = data;
              if (this.household.foods != null) {
                this.household.foods.forEach(food => {
                  if (!this.foodCategories.includes(food.category)) {
                    this.foodCategories.push(food.category);
                  }
                });
              }
            });
          }
        }
      });
    }

    this.food_validation_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.required
      ])),
      description: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(0),
        Validators.maxLength(32)
      ])),
      category: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.required
      ])),
      quantity: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{0,3}$'),
        Validators.minLength(1),
        Validators.maxLength(3),
        Validators.required
      ])),
      barCode: new FormControl('', Validators.compose([
        Validators.pattern('^^[0-9]{13}$'),
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.required
      ])),
      tags: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_,.-]+$'),
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.required
      ]))
    });

    this.addFood_validation_form = this.formBuilder.group({
      food: new FormControl('', Validators.required),
      expiration: new FormControl('', Validators.required),
      description: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(0),
        Validators.maxLength(32)
      ])),
      quantity: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{0,3}$'),
        Validators.minLength(1),
        Validators.maxLength(3),
        Validators.required
      ]))
    });
  }

  ngOnDestroy(): void {
    if (this.scanningBarcode){
      this.stopScan();
    }
  }

  openMenu() {
    this.menuCtrl.enable(true);
  }

  addFood(values: any) {
    let food = values['food'];
    food.expiration = new Date(values['expiration']);
    if (values['description'] != null && values['description'] != ""){
      food.description = values['description'];
    }
    food.quantity = values['quantity'];
    this.pantry.foods.push(food);
    this.setOpen(false);
  }

  newFood(values: any) {
    let food = new Food();
    food.name = values['name'];
    food.description = values['description'];
    food.category = values['category'];
    food.barCode = values['barCode'];
    food.tags = values['tags'].split(',');
    this.household.foods.push(food);
    this.firebaseService.updateHousehold(this.household);
    food.expiration = values['expiration'];
    food.quantity = values['quantity'];
    this.pantry.foods.push(food);
    this.firebaseService.updatePantry(this.pantry);
    this.setOpen(false);
  }

  async deleteFood(index: number) {
    this.pantry.foods.splice(index, 1);

    try {
      this.firebaseService.updatePantry(this.pantry);
      const toast = await this.toastController.create({
        message: 'Alimento eliminado correctamente!',
        duration: 1500,
        icon: 'trash'
      });
      await toast.present();

    } catch (error) {
      const toast = await this.toastController.create({
        message: '¡Error al eliminar el alimento!',
        duration: 1500,
        icon: 'trash'
      });
      await toast.present();
    }
  }

  async scanFood(mode: number) {
    try {
      this.scanningBarcode = true;
      this.setOpen(false);
      this.startScan(mode);
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error: ' + error,
        duration: 5000,
        icon: 'barcode'
      });
      await toast.present();
    }
  }

  async checkPermission() {
    const status = await BarcodeScanner.checkPermission({ force: false });

    if (status.granted) {
      return true;
    }
    if (status.denied || status.neverAsked) {
      const c = confirm('Por favor, entre en Permisos de la aplicación y permita el acceso a la cámara para leer los códigos de barra');
      this.scanningBarcode = false;
      if (c) {
        BarcodeScanner.openAppSettings();
      } else {
        return false;
      }
    }
    if (status.restricted || status.unknown) {
      this.scanningBarcode = false;
      return false;
    }

    const statusRequest = await BarcodeScanner.checkPermission({ force: true });
    if (statusRequest.granted) {
      return true;
    }
    this.scanningBarcode = false;
    return false;
  };

  async startScan(mode: number) {
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
      const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.EAN_13] });
      if (result?.hasContent) {
        const toast = await this.toastController.create({
          message: 'Barcode: ' + result.content,
          duration: 1500,
          icon: 'barcode'
        });
        await toast.present();
        switch (mode) {
          case 0:
            this.food_validation_form.patchValue({ barCode: result.content });
            this.setOpen(true);
            this.typeModal = "newFood";
            break;
          case 1:
            this.household.foods.forEach(food => {
              console.log(food.barCode+ " vs " + result.content);
              if (food.barCode == result.content) {
                this.addFood_validation_form.patchValue({ food: food });
              }
            });
            this.setOpen(true);
            break;
        }
        BarcodeScanner.showBackground();
        const body = document.querySelector('body');
        if (body) {
          body.classList.remove('scanner-active');
          this.scanningBarcode = false;
        }
      } else {
        const toast = await this.toastController.create({
          message: '¡El alimento escaneado no existe!',
          duration: 1500,
          icon: 'barcode'
        });
        await toast.present();
      }
    } catch (error) {
      const toast = await this.toastController.create({
        message: '¡Error al leer el código de barras!' + error,
        duration: 1500,
        icon: 'barcode'
      });
      await toast.present();
      console.log("Error:", error);
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
    this.scanningBarcode = false;
  };

  setSourceFood(source: string) {
    this.typeModal = source;
  }

  setOpen(isOpen: Boolean) {
    if (isOpen == true) {
      this.typeModal = "buttons";
    } else {
      this.typeModal = "";
      if (!this.scanningBarcode){
        this.selectedFood = "";
        this.food_validation_form.reset();
      }
    }
    this.isModalOpen = isOpen;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };
}
