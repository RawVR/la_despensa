import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, MenuController, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { Household } from '../modelo/household';
import { ShoppingCart } from '../modelo/shopping-carts';
import { User } from '../modelo/user';
import { log } from 'console';

@Component({
  selector: 'app-shopping-carts',
  templateUrl: './shopping-carts.page.html',
  styleUrls: ['./shopping-carts.page.scss'],
})
export class ShoppingCartsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  shopping_cart_validation_form: FormGroup;
  isModalOpen: Boolean;
  shoppingCart: ShoppingCart;
  shoppingCarts: ShoppingCart[];
  shoppingCartsHistory: ShoppingCart[];
  userSelected: User;
  showHistory: Boolean;
  users: User[];
  user: User;


  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private navCtrl: NavController, private menuCtrl: MenuController,
    private authService: FirebaseAuthService, private firebaseService: FireServiceProvider,
    public translate: TranslateService, public formBuilder: FormBuilder) {
    this.user = new User();
    this.shoppingCarts = [];
    this.isModalOpen = false;
    if (localStorage.getItem('showHistory') != null){
      let showHistory = localStorage.getItem('showHistory');
      if (localStorage.getItem('showHistory') == "true"){
        this.showHistory = true;
      } else {
        this.showHistory = false;
      }
    } else {
      localStorage.setItem('showHistory', "true")
      this.showHistory = true;
    }
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
        this.users = [];
        this.getShoppingCarts();
      });
    }

    this.shopping_cart_validation_form = this.formBuilder.group({
      description: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.required
      ])),
      supermarket: new FormControl('', Validators.compose([
        Validators.pattern('^[a-z A-ZáéíóúÁÉÍÓÚ0-9_.-]+$'),
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.required
      ])),
      purchase_date: new FormControl(''),
      users: new FormControl('')
    });
  }

  newShoppingCart(values: any) {
    let shoppingCart = new ShoppingCart();
    shoppingCart.description = values['description'];
    shoppingCart.supermarket = values['supermarket'];
    shoppingCart.purchaseDate = values["purchaseDate"];
    shoppingCart.users.push(this.user.id);
    if (values['users'] != null){
      values['users'].forEach((value: any) => {
        shoppingCart.users.push(value);
      });
    }
    this.firebaseService.insertShoppingCart(shoppingCart, this.user.id).then(() => {
      this.shoppingCarts.push(this.shoppingCart);
      this.sortShoppingCarts();
    });
    this.setOpen(false);
    this.shopping_cart_validation_form.reset();
  }

  showShoppingCart(index: number, history: Boolean) {
    if (history){
      localStorage.setItem('shoppingCart.id', this.shoppingCartsHistory[index].id);
    } else {
      localStorage.setItem('shoppingCart.id', this.shoppingCarts[index].id);
    }
    this.router.navigate(['/show-shopping-cart']);
  }

  deleteShoppingCart(index: number, history: Boolean) {
    if (history){
      this.firebaseService.deleteShoppingCart(this.shoppingCartsHistory[index].id).then((deleted) => {
        if (deleted){
          this.shoppingCartsHistory.splice(index, 1);
        }
      });
    } else {
      this.firebaseService.deleteShoppingCart(this.shoppingCarts[index].id).then((deleted) => {
        if (deleted){
          this.shoppingCarts.splice(index, 1);
        }
      });;
    }
  }

  setOpen(isOpen: Boolean) {
    if (isOpen) {
      if (this.user.id) {
        this.firebaseService.getHouseholds(this.user.id)
          .then((dataAHouseholds) => {
            dataAHouseholds.forEach(household => {
              Promise.all(
                household.users.map(userId => this.firebaseService.getUser(userId))
              ).then(users => {
                users.forEach(user => {
                  this.users.push(user);
                  if (this.user.id == user.id) {
                    this.users.splice(this.users.indexOf(user), 1);
                  }
                });
              });

            });
          });
        this.isModalOpen = isOpen;
        this.handleRefresh(null);
      }
    }
    else {
      this.isModalOpen = isOpen;
      this.handleRefresh(null);
    }
  }

  sortShoppingCarts() {
    this.shoppingCarts.sort(function (a, b) {
      if (a.purchaseDate < b.purchaseDate)
        return -1;
      else if (a.purchaseDate > b.purchaseDate)
        return 1;
      else
        return 0;
    });
    this.shoppingCartsHistory.sort(function (a, b) {
      if (a.purchaseDate > b.purchaseDate)
        return -1;
      else if (a.purchaseDate < b.purchaseDate)
        return 1;
      else
        return 0;
    });
  }

  toggleShowHistory(show: Boolean) {
    if (show){
      localStorage.setItem('showHistory', "true")
      this.showHistory = true;
    } else {
      localStorage.setItem('showHistory', "false")
      this.showHistory = false;
    }
  }

  getShoppingCarts() {
    this.firebaseService.getShoppingCarts(this.user.id).then((data) => {
      this.shoppingCarts = [];
      this.shoppingCartsHistory = [];
      let shoppingCartsData: ShoppingCart[] = data;
      shoppingCartsData.forEach((shoppingCart) => {
        if (shoppingCart.history){
          this.shoppingCartsHistory.push(shoppingCart);
        } else {
          this.shoppingCarts.push(shoppingCart);
        }
      })
      this.sortShoppingCarts();
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getShoppingCarts();
      event.target.complete();
    }, 2000);
  };
}