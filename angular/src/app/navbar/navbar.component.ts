import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userId!: any;
    isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId'); // Replace with the actual method to get the user ID
    this.checkAuth();
  }

  checkAuth(): void {
    const token = localStorage.getItem('accessToken');
    this.isLoggedIn = !!token;
    this.userId = localStorage.getItem('userId');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
}
