import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { User } from '../modelo/user';

@Component({
  selector: 'app-show-household-foods',
  templateUrl: './show-household-foods.page.html',
  styleUrls: ['./show-household-foods.page.scss'],
})
export class ShowHouseholdFoodsPage implements OnInit {
  user: User;

  constructor(private firebaseService: FireServiceProvider, public translate: TranslateService) {
    document.body.setAttribute('color-theme', localStorage.getItem('color-theme'));
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

}
