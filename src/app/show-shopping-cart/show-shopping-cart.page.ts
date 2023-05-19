import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, MenuController, NavController } from '@ionic/angular';
import { ShoppingCart } from '../modelo/shopping-carts';
import { User } from '../modelo/user';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';

@Component({
  selector: 'app-show-shopping-cart',
  templateUrl: './show-shopping-cart.page.html',
  styleUrls: ['./show-shopping-cart.page.scss'],
})
export class ShowShoppingCartPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  shoppingCart: ShoppingCart;
  user: User;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private navCtrl: NavController, private menuCtrl: MenuController,
    private authService: FirebaseAuthService, private firebaseService: FireServiceProvider,
    public translate: TranslateService, public formBuilder: FormBuilder) {
    this.user = new User();
    this.shoppingCart = new ShoppingCart();

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

    const shoppingCartID = localStorage.getItem('shoppingCart.id');
    if (shoppingCartID) {
      this.firebaseService.getShoppingCart(shoppingCartID).then((data) => {
        this.shoppingCart = data;
      });
    }
  }

  navigateToHouseholds() {
    this.router.navigateByUrl('/households', { skipLocationChange: true });
  }
  
}
