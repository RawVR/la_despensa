import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { User } from '../modelo/user';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: User;
  actualLanguage: string;
  actualTheme: string;

  constructor(private firebaseService: FireServiceProvider, private location: Location,
    public translate: TranslateService) {
    this.actualTheme = localStorage.getItem('color-theme');
    document.body.setAttribute('color-theme', this.actualTheme);
    this.user = new User();

    let language = localStorage.getItem('language');
    this.translate.setDefaultLang('en');
    if (language) {
      this.translate.use(language);
      this.actualLanguage = language;
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

  handleChangeLanguage(language: any) {
    localStorage.setItem('language', language.detail.value);
    this.translate.use(language.detail.value);
  }

  handleChangeTheme(theme: any) {
    this.actualTheme = theme.detail.value;
    localStorage.setItem('color-theme', this.actualTheme);
    document.body.setAttribute('color-theme', this.actualTheme);
  }

  backButton() {
    this.location.back();
  }
}