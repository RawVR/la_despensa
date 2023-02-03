import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { User } from '../modelo/user';

@Component({
  selector: 'app-shopping-carts',
  templateUrl: './shopping-carts.page.html',
  styleUrls: ['./shopping-carts.page.scss'],
})
export class ShoppingCartsPage implements OnInit {
  user: User;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private navCtrl: NavController, private menuCtrl: MenuController,
    private authService: FirebaseAuthService, private firebaseService: FireServiceProvider,
    public translate: TranslateService) {
    this.user = new User();

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
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };
}