import { Component, Renderer2 } from '@angular/core';
import { Coach, JourSemaine } from '../models/coach';
import { CoachService } from '../services/coach.service';
import Swal from 'sweetalert2';
import { Reservation, Status } from '../models/reservation';
import { ReservationService } from '../services/reservation.service';
import { AuthService } from '../services/auth.service';
declare var $:any;
@Component({
  selector: 'app-planification-coach',
  templateUrl: './planification-coach.component.html',
  styleUrls: ['./planification-coach.component.css']
})
export class PlanificationCoachComponent {
  joursSemaine = JourSemaine; // Importez l'enum Jours pour l'utiliser dans le template
  coachParJour: { [key in JourSemaine]: Coach[] } = {
    LUNDI: [],
    MARDI: [],
    MERCREDI: [],
    JEUDI: [],
    VENDREDI: [],
    SAMEDI: [],
    DIMANCHE: []
  };
  isLoggedIn: boolean = false;

  constructor(private renderer: Renderer2,private coachService: CoachService,private reservationService: ReservationService
    , private authService: AuthService
  ) {}

  ngOnInit() {
    this.setBackground();
    this.fetchCoachByDay();
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngAfterViewInit() {
    // Initialise les tooltips
    $('[data-toggle="tooltip"]').tooltip();
  }

  setBackground() {
    this.renderer.setStyle(document.body, 'backgroundImage', 'url(../../assets/images/gymblack.jpg)');
    this.renderer.setStyle(document.body, 'backgroundSize', 'cover');
    this.renderer.setStyle(document.body, 'height', '100vh');
    this.renderer.setStyle(document.body, 'margin', '0');
  }

  fetchCoachByDay(): void {
    Object.keys(this.joursSemaine).forEach(jour => {
      const jourEnum = this.joursSemaine[jour as keyof typeof JourSemaine];
      this.coachService.getCoachByDay(jourEnum).subscribe(
        (coach: Coach[]) => {
          this.coachParJour[jourEnum] = coach;
          console.log(`coach pour ${jourEnum} :`, coach);
        },
        error => {
          console.error(`Erreur lors de la récupération des coachs pour ${jourEnum} :`, error);
        }
      );
    });
  }


  reserveCoach(coach: Coach, jour: string): void {
    if (this.isLoggedIn) {
      const userId = +localStorage.getItem('userId')!;
      if (!isNaN(userId)) {
        const inputOptions: { [key: string]: string } = coach.heures.reduce((options: { [key: string]: string }, heure: string) => {
          options[heure] = heure;
          return options;
        }, {});

        Swal.fire({
          title: 'Choisissez une heure',
          input: 'select',
          inputOptions: inputOptions,
          inputPlaceholder: 'Sélectionnez une heure',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            const selectedHeure = result.value;
            const reservation: Reservation = {
              id: 0,
              date: jour,
              heure: selectedHeure,
              status: Status.EN_ATTENTE,
              user: {
                id: userId,
                username: '',
                email: '',
                password: '',
                birthdate: '',
                phone: ''
              },
              coach: {
                id: coach.id,
                nom: coach.nom,
                image: coach.image,
                users: coach.users,
                dates: coach.dates,
                heures: coach.heures,
                specialite: coach.specialite,
                prenom: coach.prenom
              }
            };

            this.reservationService.addReservation(reservation).subscribe(
              () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Réservation ajoutée avec succès!',
                  showConfirmButton: false,
                  timer: 1500
                });
              },
              error => {
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur lors de l\'ajout de la réservation:',
                  showConfirmButton: false,
                  timer: 1500
                });
                console.error('Erreur lors de l\'ajout de la réservation:', error);
              }
            );
          }
        });
      } else {
        console.error('L\'ID utilisateur n\'est pas valide.');
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Vous devez être connecté pour réserver un coach',
        showConfirmButton: true
      });
    }
  }


}