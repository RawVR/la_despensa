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
  userSelected: User;
  users: User[];
  user: User;


  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private navCtrl: NavController, private menuCtrl: MenuController,
    private authService: FirebaseAuthService, private firebaseService: FireServiceProvider,
    public translate: TranslateService, public formBuilder: FormBuilder) {
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
        this.users = [];
        this.firebaseService.getShoppingCarts(this.user.id).then((data) => {
          this.shoppingCarts = [];
          this.shoppingCarts = data;
        });
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
      users: new FormControl('', Validators.required)
    });
  }

  newShoppingCart(values: any) {
    let shoppingCarts = new ShoppingCart();
    shoppingCarts.description = values['description'];
    shoppingCarts.supermarket = values['supermarket'];
    this.firebaseService.insertShoppingCart(shoppingCarts, this.user.id);
    this.setOpen(false);
    this.shopping_cart_validation_form.reset();
  }

  showShoppingCart(index: number) {
    localStorage.setItem('shoppingCart.id', this.shoppingCarts[index].id)
    this.router.navigate(['/show-shopping-cart']);
  }

  deleteShoppingCart(index: number) {
    this.firebaseService.deleteShoppingCart(this.shoppingCarts[index]);
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

  handleRefresh(event: any) {
    setTimeout(() => {
      this.firebaseService.getShoppingCarts(this.user.id).then((data) => {
        this.shoppingCarts = [];
        this.shoppingCarts = data;
      });
      event.target.complete();
    }, 2000);
  };
}