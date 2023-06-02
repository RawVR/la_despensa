import { Component, OnInit } from '@angular/core';
import { User } from '../modelo/user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { PantryFood } from '../modelo/pantry-food';
import { Pantry } from '../modelo/pantry';
import { Location } from '@angular/common';
import { Household } from '../modelo/household';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-show-pantry-food',
  templateUrl: './show-pantry-food.page.html',
  styleUrls: ['./show-pantry-food.page.scss'],
})
export class ShowPantryFoodPage implements OnInit {
  food_validation_form: FormGroup;
  isEditing: boolean;
  user: User;
  food: PantryFood;
  tags: string;
  pantry: Pantry;
  household: Household;
  foodCategories: string[];


  constructor(private router: Router, private route: ActivatedRoute, public formBuilder: FormBuilder,
    private firebaseService: FireServiceProvider, public translate: TranslateService, private location: Location) {
    document.body.setAttribute('color-theme', localStorage.getItem('color-theme'));
    this.user = new User();
    this.household = new Household();
    this.pantry = new Pantry();
    this.foodCategories = [];
    this.food = new PantryFood;
    this.isEditing = false;
    this.tags = "";

    let language = localStorage.getItem('language');
    this.translate.setDefaultLang('en');
    if (language) {
      this.translate.use(language);
    }
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

    const foodParam = this.route.snapshot.queryParamMap.get('food');
    try {
      this.food = JSON.parse(foodParam);
      console.log(this.food)
      this.food.tags.forEach((tag) => {
        this.tags += tag + ", ";
      });
      JsBarcode("#barcode", this.food.barCode, {
        format: "EAN13",
        lineColor: "#333333",
        width: 3,
        height: 100,
        displayValue: true
      });
    } catch (error) {
      console.log("Error: " + error);
    }
    
    this.food_validation_form = this.formBuilder.group({
      name: new FormControl(this.food.name, Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.required
      ])),
      description: new FormControl(this.food.description, Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(0),
        Validators.maxLength(32)
      ])),
      category: new FormControl(this.food.category, Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.required
      ])),
      quantity: new FormControl(this.food.quantity, Validators.compose([
        Validators.pattern('^[0-9]{0,3}$'),
        Validators.minLength(1),
        Validators.maxLength(3),
        Validators.required
      ])),
      expiration: new FormControl(this.food.expiration, Validators.required),
      barCode: new FormControl(this.food.barCode, Validators.compose([
        Validators.pattern('^[0-9]{13}$'),
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.required
      ])),
      tags: new FormControl(this.food.tags, Validators.compose([
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]{3,}(, ?[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]{3,})*$'),
        Validators.minLength(3),
        Validators.maxLength(128),
        Validators.required
      ]))
    });
  }

  editFood() {
    this.isEditing = true;
  }

  saveFood() {
    this.pantry.foods.forEach((pantryFood) => {
      if (pantryFood.barCode === this.food.barCode) {
        pantryFood.name = this.food.name;
        pantryFood.description = this.food.description;
        pantryFood.category = this.food.category;
        pantryFood.barCode = this.food.barCode;
        pantryFood.tags = this.tags.split(',');
        pantryFood.expiration = this.food.expiration;
        pantryFood.quantity = this.food.quantity;
        this.firebaseService.updatePantry(this.pantry);
      }
    });
    this.isEditing = false;
  }

  backToPantry() {
    this.isEditing = false;
    this.router.navigate(['/show-pantry']);
  }
}