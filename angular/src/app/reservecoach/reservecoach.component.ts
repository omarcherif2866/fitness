import { Component } from '@angular/core';
import { Coach } from '../models/coach';
import { CoachService } from '../services/coach.service';
import { Reservation, Status } from '../models/reservation';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservecoach',
  templateUrl: './reservecoach.component.html',
  styleUrls: ['./reservecoach.component.css']
})
export class ReservecoachComponent {
  coachId: number | undefined;
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
    coach: {
      id: 0,
      nom: '',
      image: '',
      prenom: '',
      specialite: '',
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
    this.coachId = +this.route.snapshot.paramMap.get('id')!;
    console.log('ID du coach sélectionné :', this.coachId);

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
        coach: { 
          id: this.coachId || 0, // Utiliser l'ID du cours récupéré, avec une valeur par défaut si nécessaire
          nom: '',
          image: '',
          prenom: '',
          specialite: '',
          users: [] ,
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
