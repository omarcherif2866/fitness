import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-admincours',
  templateUrl: './admincours.component.html',
  styleUrls: ['./admincours.component.css']
})
export class AdmincoursComponent {
  user!:any;


  constructor( private userService: UserService) {}




  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  // getUsers(): void {
  //   const token=localStorage.getItem("accessToken");
  // if (token!=null){  this.userService.showuser(token).subscribe(
  //   (users:any) => {
  //     this.user=users;
  //   },
  //   error => {
  //     console.error("Error fetching users:", error);
  //   }
  // );}
  }
  
















