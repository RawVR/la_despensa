import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private router: Router, private authService: FirebaseAuthService) { }

  ngOnInit() {
    this.authService.logOutUser().then(() => {
      this.router.navigate(['/login']);
    });
  }
}