import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ToastController } from '@ionic/angular';
import { User } from '../modelo/user';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Household } from '../modelo/household';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-category-foods',
  templateUrl: './category-foods.page.html',
  styleUrls: ['./category-foods.page.scss'],
})
export class CategoryFoodsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  category_validation_form: FormGroup;
  isModalOpen: Boolean;
  user: User;
  households: Household[];

  constructor(public formBuilder: FormBuilder, private firebaseService: FireServiceProvider,
    private toastController: ToastController, public translate: TranslateService) {
    this.user = new User();
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
        this.firebaseService.getHouseholds(this.user.id).then((data) => {
          this.households = [];
          this.households = data;
        });
      });
    }

    this.category_validation_form = this.formBuilder.group({
      description: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.required
      ])),
      households: new FormControl('')
    });
  }

  newCategory(values: any) {
    values['households'].forEach((householdID: string) => {
      this.households.forEach((household) => {
        if (household.id == householdID){
          household.categories.push(values['description']);
          this.firebaseService.updateHousehold(household);
        }
      });
    });
    this.setOpen(false);
    this.category_validation_form.reset();
  }

  deleteCategory(indexHousehold: number, indexCategory: number){
    this.households[indexHousehold].categories.splice(indexCategory, 1);
    this.firebaseService.updateHousehold(this.households[indexHousehold]);
  }

  setOpen(isOpen: Boolean) {
    this.isModalOpen = isOpen;
  }

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
