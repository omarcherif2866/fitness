import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userId!: any;
  ngOnInit() {
    this.userId = localStorage.getItem('userId'); // Replace with the actual method to get the user ID
  }
}
