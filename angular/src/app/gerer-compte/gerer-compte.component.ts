import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.models';
import { UserService } from '../services/user/user.service';
declare var $:any;
@Component({
  selector: 'app-gerer-compte',
  templateUrl: './gerer-compte.component.html',
  styleUrls: ['./gerer-compte.component.css']
})
export class GererCompteComponent implements OnInit {
  users: User[] = [];
  UserService: any;
  router: any;

  constructor(private authService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.authService.getAllUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        console.log('Utilisateurs récupérés avec succès****', this.users);
       
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }
  UserToDelete!:number;
  confirmDelete(iduser:number)
  {
  
  $('#deleteModal').modal('show');
  this.UserToDelete=iduser;
  
  
  }
  
  closeDelete()
  {
    $('#deleteModal').modal('hide');
  
  }
  deleteuser() {
    this.authService.deleteUser(this.UserToDelete).subscribe(
      () => {
        console.log("User deleted successfully");
        // Supprimez l'utilisateur de la liste locale sans recharger la page
        this.users = this.users.filter(user => user.id !== this.UserToDelete);
  
        // Fermez le modal
        $('#deleteModal').modal('hide');
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }
  // deleteuser1(id:number)
  // {
  //   this.UserService.delete(id).subscribe(()=>{
  //     console.log("deleted")
  //     console.log(this.UserToDelete)
  //     $('#deleteModal').modal('hide');
  //     window.location.reload();
      
  
  //   })}
  deleteuser1(userId: number) {
    console.log('Attempting to delete user with id:', userId);
    const user = this.users.find(u => u.id === userId);
    if (user) {
      console.log('User found:', user);
      this.authService.deleteUser(userId).subscribe(() => {
        console.log('User deleted successfully');
        this.users = this.users.filter(u => u.id !== userId);
      }, 
      );
    } else {
      console.error('User not found');
    }
  }
  
  updateUser(id :number)
  {
  this.router.navigate(["/update",id])
  }
}

