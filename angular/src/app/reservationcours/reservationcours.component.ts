import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { Reservation, Status } from '../models/reservation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservationcours',
  templateUrl: './reservationcours.component.html',
  styleUrls: ['./reservationcours.component.css']
})
export class ReservationcoursComponent {
  coursId: number | undefined;
  reservation: Reservation = {
    id: 0,
    date: '',
    heure: '',
    status: Status.EN_ATTENTE,
    user: {
      id: 0,
      username: '',
      email: '',
      password: '',
      birthdate: '',
      phone: '',
      blocked:false

    },
    cours: {
      id: 0,
      nom: '',
      image: '',
      users: [],
      dates:[],
      heures:[]
    }
  };

  constructor(private route: ActivatedRoute, private reservationService: ReservationService) {
        // Définir le style de fond directement dans le constructeur
        document.body.style.backgroundImage = 'url(../../assets/images/gymblack.jpg)';
        document.body.style.backgroundSize = 'cover';
        document.body.style.height = '100vh';
        document.body.style.margin = '0';
  }

  ngOnInit(): void {
    this.coursId = +this.route.snapshot.paramMap.get('id')!;
    console.log('ID du cours sélectionné :', this.coursId);

    const userId = +localStorage.getItem('userId')!;
    if (!isNaN(userId)) {
      this.reservation.user.id = userId;
    } else {
      console.error('Invalid user ID.');
      // Handle error if user ID is invalid or not available
    }
  }
  

  addReservation() {
    const userId = +localStorage.getItem('userId')!;
    if (!isNaN(userId)) {
      const reservation: Reservation = {
        id: 0, // L'id sera généré par le backend
        date: this.reservation.date,
        heure: this.reservation.heure,
        status: Status.EN_ATTENTE,
        user: { 
          id: userId,
          username: '', // Remplissez avec les autres propriétés requises de User
          email: '',
          password: '',
          birthdate: '',
          phone: '',
          blocked:false

        },
        cours: { 
          id: this.coursId || 0, // Utiliser l'ID du cours récupéré, avec une valeur par défaut si nécessaire
          nom: '', // Remplissez avec les autres propriétés requises de Cours
          image: '',
          users: [],
          dates:[],
          heures:[]
        },
      };
  
      // Appeler le service pour ajouter la réservation
      this.reservationService.addReservation(reservation).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Réservation ajoutée avec succès!',
            showConfirmButton: false,
            timer: 1500 // Cacher automatiquement après 1.5 secondes
          });

        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de l\'ajout de la réservation:', 
            showConfirmButton: false,
            timer: 1500 // Cacher automatiquement après 1.5 secondes
          });
          console.error('Erreur lors de l\'ajout de la réservation:', error);
          // Gestion d'erreur ici
        }
      );
    } else {
      console.error('L\'ID utilisateur n\'est pas valide.');
      // Gestion d'erreur si l'ID utilisateur n'est pas valide ou n'est pas disponible
    }
  }
  
  
}




  // errorMessage: string | undefined;
  // successMessage: string | undefined;
  // selectedDay: string = ''; // Définir la propriété selectedDay comme une chaîne de caractères
  
  // onActiviteChange(arg0: any) {
  //   throw new Error('Method not implemented.');
  // }
  
  // name: string = '';
  // date: string = '';
  // time: string = '';
  // activite: string = '';  // Déclarez la propriété 'activite'

  // constructor(private renderer: Renderer2) {
  //   document.body.style.backgroundImage = 'url(../../assets/images/gymblack.jpg)';
  //   document.body.style.backgroundSize = 'cover';
  //   document.body.style.height = '100vh';
  //   document.body.style.margin = '0';
  // }

  // addReservation() {
  //   // Vérifiez si tous les champs sont remplis
  //   if (!this.name || !this.date || !this.time || !this.activite) {
  //     this.errorMessage = 'Veuillez remplir tous les champs.';
  //     return; // Arrêtez l'exécution de la fonction si tous les champs ne sont pas remplis
  //   }

  //   // Effectuez ici la logique d'ajout de la réservation
  //   // Si la réservation est ajoutée avec succès, affichez un message de succès
  //   this.successMessage = 'La réservation a été ajoutée avec succès !';

  //   // Réinitialisez les champs après la réservation réussie
  //   this.name = '';
  //   this.date = '';
  //   this.time = '';
  //   this.activite = '';
  // }