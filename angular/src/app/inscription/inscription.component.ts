import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { Role, User } from '../models/user.models';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent  {

  formInput!: FormGroup; 
   
  

  constructor(private fb: FormBuilder, private userservice: AuthService) {
    // Définir le style de fond directement dans le constructeur
    document.body.style.backgroundImage = 'url(../../assets/images/gymblack.jpg)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
   
  }

  user :User={
    id: -1,
    username: "",
    email  : " ",
    password: " ",
    birthdate: "",
    phone: " ",


    
 }

 addUser() {
  delete this.user.role;

  return this.userservice.addUser(this.user).subscribe(
    newuser => {
      this.user = newuser;
      Swal.fire({
        icon: 'success',
        title: 'Utilisateur ajouté avec succès',
        showConfirmButton: false,
        timer: 1500 // Cacher automatiquement après 1.5 secondes
      });
      console.log("Utilisateur ajouté");
    },
    error => {
      let errorMessage = 'Erreur lors de l\'ajout de l\'utilisateur';
      if (error.error && error.error.message) {
        if (error.error.message.includes('Username')) {
          errorMessage = 'Username existe deja!';
        } else if (error.error.message.includes('Email')) {
          errorMessage = 'Email existe deja!';
        }
      }
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
        showConfirmButton: false,
        timer: 1500 // Cacher automatiquement après 1.5 secondes
      });
    }
  );
}



}
