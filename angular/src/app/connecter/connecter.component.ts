import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

 @Component({
   selector: 'app-connecter',
   templateUrl: './connecter.component.html',
   styleUrls: ['./connecter.component.css']
 })
  export class ConnecterComponent {
    
    username:string="";
    password :string="";
    
    constructor(private authService:AuthService, private router:Router ){

    }
    


    
// login() {
//   const loginData = { username: this.username, password: this.password };
//   this.authService.login(loginData).subscribe(
//     (response: any) => {
//       if (response && response.role) {
//         // Stocker les données de l'utilisateur et le token JWT dans le local storage
//         localStorage.setItem("userAuth", JSON.stringify(response.user));
//         localStorage.setItem("accessToken", response.accessToken);

//         // Utiliser le rôle retourné dans la réponse HTTP
//         const role = response.role;

//         // Rediriger en fonction du rôle de l'utilisateur
//         if (role === 'Admin') {
//           this.route.navigate(['profil']); // Rediriger vers le profil de l'admin
//         } else if (role === 'SIMPLEU'){
//           this.route.navigate(['profile']); // Rediriger vers le profil de l'utilisateur normal
//         }

//         // Afficher un message de succès
//         Swal.fire({
//           icon: 'success',
//           title: 'Connecté',
//           showConfirmButton: false,
//           timer: 1500 // Cacher automatiquement après 1.5 secondes
//         });

//         console.log("Connecté");
//       } else {
//         // Gestion des erreurs ici si le rôle est manquant dans la réponse
//         console.error("Rôle manquant dans la réponse de connexion", response);
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: 'Une erreur s\'est produite lors de la connexion'
//         });
//       }
//     },
//     error => {
//       // Gestion des erreurs ici
//       if (error.status === 401) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: 'Nom d\'utilisateur ou mot de passe incorrect'
//         });
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: 'Une erreur s\'est produite lors de la connexion'
//         });
//       }
//       console.error("Erreur de connexion", error);
//     }
//   );
// }


login() {
  const loginData = { username: this.username, password: this.password };
  this.authService.login(loginData).subscribe(
    (response: any) => {
      console.log('Response received:', response);

      if (response && response.role && response.accessToken) {
        // Store user role and access token in localStorage
        localStorage.setItem("userRole", response.role);
        localStorage.setItem("accessToken", response.accessToken);

        // Store user ID from token in localStorage
        this.authService.storeUserIdFromToken();

        // Redirect based on user role (assuming role is determined from response)
        const role = response.role;
        if (role === 'Admin') {
          this.router.navigate(['profil/', this.authService.getUserId()]); // Redirect to admin profile with user ID
        } else if (role === 'SIMPLEU') {
          this.router.navigate(['profile', this.authService.getUserId()]); // Redirect to normal user profile with user ID
        }

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Connected',
          showConfirmButton: false,
          timer: 1500 // Auto hide after 1.5 seconds
        });

        console.log("Connected");
      } else {
        // Handle errors if role or necessary data is missing in the response
        console.error("Role or essential data missing in login response", response);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during login'
        });
      }
    },
    error => {
      // Handle HTTP errors
      if (error.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Incorrect username or password'
        });
      } else if (error.status === 403) {
        // Handle account blocked scenario
        Swal.fire({
          icon: 'warning',
          title: 'Votre Compte est bloqué',
          text: 'Votre compte a été bloqué. Veuillez contacter l’assistance.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during login'
        });
      }
      console.error("Login error", error);
    }
  );
}



}

  
    
    

 
