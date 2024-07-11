import { Component, Renderer2, OnInit } from '@angular/core';
import { Cours } from '../models/cours';
import { CoursService } from '../services/cours.service';
import Swal from 'sweetalert2';
import { Reservation, Status } from '../models/reservation';
import { ReservationService } from '../services/reservation.service';
import { JourSemaine } from '../models/coach';
import { AuthService } from '../services/auth.service';
declare var $:any;
@Component({
  selector: 'app-planification',
  templateUrl: './planification.component.html',
  styleUrls: ['./planification.component.css']
})
export class PlanificationComponent implements OnInit {
  joursSemaine = JourSemaine; // Importez l'enum Jours pour l'utiliser dans le template
  coursParJour: { [key in JourSemaine]: Cours[] } = {
    LUNDI: [],
    MARDI: [],
    MERCREDI: [],
    JEUDI: [],
    VENDREDI: [],
    SAMEDI: [],
    DIMANCHE: []
  };
  isLoggedIn: boolean = false;
  constructor(private renderer: Renderer2,private coursService: CoursService,private reservationService: ReservationService
    , private authService: AuthService
  ) {}

  ngOnInit() {
    this.setBackground();
    this.fetchCoursByDay();
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngAfterViewInit() {
    // Initialise les tooltips
    $('[data-toggle="tooltip"]').tooltip();
  }

  fetchCoursByDay(): void {
    Object.keys(this.joursSemaine).forEach(jour => {
      const jourEnum = this.joursSemaine[jour as keyof typeof JourSemaine];
      this.coursService.getCoursByDay(jourEnum).subscribe(
        (cours: Cours[]) => {
          this.coursParJour[jourEnum] = cours;
          console.log(`Cours pour ${jourEnum} :`, cours);
        },
        error => {
          console.error(`Erreur lors de la récupération des cours pour ${jourEnum} :`, error);
        }
      );
    });
  }


  reserveCours(cours: Cours, jour: string): void {
    if (this.isLoggedIn) {
      const userId = +localStorage.getItem('userId')!;
      if (!isNaN(userId)) {
        const inputOptions: { [key: string]: string } = cours.heures.reduce((options: { [key: string]: string }, heure: string) => {
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
                username: '', // Remplissez avec les autres propriétés requises de User
                email: '',
                password: '',
                birthdate: '',
                phone: ''
              },
              cours: {
                id: cours.id,
                nom: cours.nom,
                image: cours.image,
                users: cours.users,
                dates: cours.dates,
                heures: cours.heures
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
        title: 'Vous devez être connecté pour réserver un cours',
        showConfirmButton: true
      });
    }
  }












  setBackground() {
    this.renderer.setStyle(document.body, 'backgroundImage', 'url(../../assets/images/gymblack.jpg)');
    this.renderer.setStyle(document.body, 'backgroundSize', 'cover');
    this.renderer.setStyle(document.body, 'height', '100vh');
    this.renderer.setStyle(document.body, 'margin', '0');
  }

  confirmDelete()
  {

  $('#deleteModal').modal('show');

  }

  closeDelete()
  {
    $('#deleteModal').modal('hide');

  }
delete()
{
console.log(" Deleted");

$('#deleteModal').modal('hide');
  }
}
