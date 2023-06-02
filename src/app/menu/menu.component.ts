import { Component, OnInit } from '@angular/core';
import { User } from '../modelo/user';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  user: User;

  constructor(private firebaseService: FireServiceProvider, public translate: TranslateService,
    private menuCtrl: MenuController) {
    document.body.setAttribute('color-theme', localStorage.getItem('color-theme'));
    this.user = new User();
    this.user.first_name = "a"
    let language = localStorage.getItem('language');
    this.translate.setDefaultLang('en');
    if (language) {
      this.translate.use(language);
    }
  }

  ngOnInit() {
    setTimeout(() => {
      const userID = localStorage.getItem('user.id');
      if (userID) {
        this.firebaseService.getUser(userID).then((data) => {
          this.user = data;
        });
      }
    }, 1000);
  }
}
