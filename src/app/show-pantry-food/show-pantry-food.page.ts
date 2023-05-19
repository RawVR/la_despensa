import { Component, OnInit } from '@angular/core';
import { User } from '../modelo/user';
import { MenuController, ToastController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { Household } from '../modelo/household';
import { Pantry } from '../modelo/pantry';
import { PantryFood } from '../modelo/pantry-food';

@Component({
  selector: 'app-show-pantry-food',
  templateUrl: './show-pantry-food.page.html',
  styleUrls: ['./show-pantry-food.page.scss'],
})
export class ShowPantryFoodPage implements OnInit {
  user: User;
  food: PantryFood;

  constructor(private router: Router, private route: ActivatedRoute, private toastController: ToastController,
    private menuCtrl: MenuController, public formBuilder: FormBuilder, private firebaseService: FireServiceProvider,
    public translate: TranslateService) {
    this.user = new User();
    this.food = new PantryFood;

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

    const foodParam = this.route.snapshot.queryParamMap.get('food');
    try {
      this.food = JSON.parse(foodParam);
    } catch (error) {
    }
    console.log(this.food)
  }

  navigateToHouseholds() {
    this.router.navigateByUrl('/households', { skipLocationChange: true });
  }
}
