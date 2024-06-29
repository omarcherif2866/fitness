import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { User } from '../models/user.models';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Reservation } from '../models/reservation';
import { ReservationService } from '../services/reservation.service';
import { Cours, JourSemaine } from '../models/cours';
import { CoachService } from '../services/coach.service';
import { TerrainService } from '../services/terrain.service';
import { CoursService } from '../services/cours.service';
import { Terrain } from '../models/terrain';
import { Coach } from '../models/coach';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  @Input() fullWidthMode = false;
  idUser: any;

  imageUrl: string | ArrayBuffer | null = null;
  selectedFileName: string = '';

  user: User = {} as User;
  ProfileForm!: FormGroup;
  errorMessage: string = '';

  submitted = false;
  reservations: Reservation[] = [];
  pageTitle: string = '';
  displayReservations: boolean = false;
  ReservationForm!: FormGroup;
  selectedReservation: Reservation | null = null;

  displayProfil: boolean = false;
  isSimpleUser: boolean = false;
  isAdmin: boolean = false;

  afficherForm: string = '';
  joursSemaine: JourSemaine[] = [
    JourSemaine.LUNDI,
    JourSemaine.MARDI,
    JourSemaine.MERCREDI,
    JourSemaine.JEUDI,
    JourSemaine.VENDREDI,
    JourSemaine.SAMEDI,
    JourSemaine.DIMANCHE,
  ];   
  joursHeure: string[] = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    , '19:00', '20:00', '21:00', '22:00'
  ];
  coachsList: Coach[] = [];
  terrainsList: Terrain[] = [];
  coursList: Cours[] = [];
  
  constructor(
    public userService: UserService,
    public authService: AuthService,
    public reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private coachService: CoachService,
    private terrainService: TerrainService,
    private coursService: CoursService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();
    this.initProfileForm();
    this.getUserById();
    this.showProfil()
    this.checkUserRole();
    // this.initDatesFormArray();
    // this.initHeuresFormArray();
    this.ReservationForm = this.formBuilder.group({
      // cours: ['', Validators.required],
      // terrain: ['', Validators.required],
      // coach: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      // Ajoutez d'autres contrôles si nécessaire
    });
  }

  checkUserRole(): void {
    const userRole = localStorage.getItem('userRole'); // Assuming userRole is stored in local storage
    if (userRole === 'SIMPLEU') {
      this.isSimpleUser = true;
    } else if (userRole === 'Admin')
      {
        this.isAdmin = true;
      }
  }

  initForm() {
    this.ReservationForm = this.formBuilder.group({
      cours: [''],
      terrain: [''],
      coach: [''],
      dates: this.formBuilder.array(this.joursSemaine.map(() => this.formBuilder.control(false))),
      heures: this.formBuilder.array(this.joursHeure.map(() => this.formBuilder.control(false)))
    });
  }

  loadDropdownData() {
    this.coachService.getAllCoach().subscribe(
      (data: Coach[]) => this.coachsList = data, // Update type based on your Coach model
      error => console.error('Error fetching coachs:', error)
    );

    this.terrainService.getAllTerrain().subscribe(
      (data: Terrain[]) => this.terrainsList = data, // Update type based on your Terrain model
      error => console.error('Error fetching terrains:', error)
    );

    this.coursService.getAllCours().subscribe(
      (data: Cours[]) => this.coursList = data, // Update type based on your Cours model
      error => console.error('Error fetching cours:', error)
    );
  }

  initProfileForm(): void {
    this.ProfileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', [Validators.required]],
      phone: ['', [Validators.required]],

    });
  }


  onSubmit() {
    this.submitted = true;
  
    if (this.ProfileForm.invalid) {
      return;
    }
  
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      const userId = +userIdString; // Convert the string to a number using the unary plus operator (+)
  
      // Créer une instance de User à partir des valeurs du formulaire
      const user: User = {
        id: userId,
        username: this.ProfileForm.get('username')?.value,
        email: this.ProfileForm.get('email')?.value,
        password: this.ProfileForm.get('password')?.value,
        phone: this.ProfileForm.get('phone')?.value,
        birthdate: this.ProfileForm.get('birthdate')?.value
      };
  
      this.authService.updateUser(userId, user).subscribe(
        (updatedUser) => {
          if (updatedUser) {
            this.user = updatedUser;
            Swal.fire({
              icon: 'success',
              title: 'Profile updated successfully',
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Update failed',
              text: 'Data is incorrect.',
              confirmButtonText: 'OK'
            });
          }
        },
        (error) => {
          console.error('Error updating user profile:', error);
        }
      );
    } else {
      console.error("ID not found in localStorage.");
    }
  }


  getUserById(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (user: any) => {
          if (user) {
            this.user = user;
            this.ProfileForm.patchValue({
              username: user.username,
              email: user.email,
              birthdate: user.birthdate,
              phone: user.phone,
            });
          }
        },
        (error) => {
          console.error('Error fetching user profile:', error);
          this.errorMessage = 'Failed to fetch user profile';
        }
      );
    } else {
      console.error('User ID not found in localStorage.');
      this.errorMessage = 'User ID not found';
    }
  }
  

  showReservations() {
    this.displayReservations = true
    this.displayProfil = false

    this.pageTitle = 'Mes reservations';
    this.getReservationsByUserId(); // Call the function here

  }

  showProfil() {
    this.displayReservations = false
    this.displayProfil = true

    this.pageTitle = 'Profil';
  }

  getReservationsByUserId(): void {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      this.idUser = +userIdString; // Convert the string to a number using the unary plus operator (+)
      console.log('Fetching reservations for user ID:', this.idUser); // Add a console log
      this.reservationService.getReservationsByUserId(this.idUser).subscribe((data: Reservation[]) => {
        this.reservations = data;
        console.log('Reservations fetched:', this.reservations); // Add a console log
      }, error => {
        console.error('Error fetching reservations:', error);
      });
    } else {
      console.error('User ID not found in local storage.');
    }
  }






  afficherFormulaire(formType: string): void {
    this.afficherForm = formType;
    this.selectedReservation = null; // Clear the selected reservation when opening the form for a new reservation

    // Initialize the dates and hours form arrays
    // this.initDatesFormArray();
    // this.initHeuresFormArray();
  }

  saveOrUpdate(): void {
    if (this.ReservationForm.valid) {
      // Récupérer les valeurs directement depuis les contrôles du formulaire
      const selectedDate: string = this.ReservationForm.value.date; // Supposant que date est une chaîne simple
      const selectedHeure: string = this.ReservationForm.value.heure; // Supposant que heure est une chaîne simple
    
      // Récupérer l'ID de l'utilisateur depuis localStorage
      const userId = localStorage.getItem('userId');
    
      if (userId) {
        // Appel à votre service pour récupérer l'utilisateur complet par son ID
        this.userService.getUserById(userId).subscribe(
          (user: any) => {
            // Construction des données de la réservation avec l'utilisateur complet
            const reservationData = {
              // cours: this.coursList.find(c => c.id === this.ReservationForm.value.cours),
              // terrain: this.terrainsList.find(t => t.id === this.ReservationForm.value.terrain),
              // coach: this.coachsList.find(c => c.id === this.ReservationForm.value.coach),
              date: selectedDate,
              heure: selectedHeure,
              user: user  // Utilisateur complet récupéré depuis le service
            };
    
            console.log('Données de la réservation:', reservationData);
    
            if (this.selectedReservation) {
              console.log('Mise à jour de la réservation avec ID:', this.selectedReservation.id);
              this.updateReservation(this.selectedReservation.id, reservationData);
            } 
          },
          error => {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          }
        );
      } else {
        console.log('ID de l\'utilisateur non trouvé dans localStorage.');
      }
    } else {
      console.log('Formulaire invalide. Veuillez vérifier les champs requis.');
    }
  }
  
  
  
  
  

  updateReservation(id: any, reservationData: any) {
    this.reservationService.updateReservation(id, reservationData).subscribe(
      res => {
        Swal.fire({
          icon: 'success',
          title: 'Réservation mise à jour avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.closeForm();
        this.getReservationsByUserId();

      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la mise à jour de la réservation',
          showConfirmButton: false,
          timer: 1500
        });
        console.error('Erreur lors de la mise à jour de la réservation:', error);
      }
    );
  }



  editReservation(reservation: Reservation) {
    this.selectedReservation = reservation;
    this.afficherForm = 'editForm'; // Affiche le formulaire de modification
  
    // Patch form controls directly
    this.ReservationForm.patchValue({
      date: reservation.date, // Assurez-vous que reservation.date est une string ou une date simple
      heure: reservation.heure, // Assurez-vous que reservation.heure est une string ou une heure simple
      // status: reservation.status,
      // user: reservation.user.username,
      // cours: reservation.cours ? reservation.cours.id : null,
      // terrain: reservation.terrain ? reservation.terrain.id : null,
      // coach: reservation.coach ? reservation.coach.id : null,
    });
  }
  

  
  
  
  
  
  

  deleteReservation(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Réservation supprimée avec succès',
            showConfirmButton: false,
            timer: 1500
          });
          this.getReservationsByUserId(); // Mettre à jour la liste des réservations après la suppression
        },
        error => {
          console.error('Erreur lors de la suppression de la réservation:', error);
        }
      );
    }
  }

  // initDatesFormArray() {
  //   const datesArray = this.ReservationForm.get('dates') as FormArray;
  //   this.joursSemaine.forEach(() => {
  //     datesArray.push(new FormControl(false));
  //   });
  // }
  
  // initHeuresFormArray() {
  //   const heuresArray = this.ReservationForm.get('heures') as FormArray;
  //   this.joursHeure.forEach(() => {
  //     heuresArray.push(new FormControl(false));
  //   });
  // }

  // getDatesControls(): AbstractControl[] {
  //   const formArray = this.ReservationForm.get('dates') as FormArray;
  //   return formArray.controls;
  // }

  // getHeuresControls(): AbstractControl[] {
  //   const formArray = this.ReservationForm.get('heures') as FormArray;
  //   return formArray.controls;
  // }

  // getDateControl(index: number): FormControl {
  //   const formArray = this.ReservationForm.get('dates') as FormArray;
  //   return formArray.at(index) as FormControl;
  // }

  // getHeureControl(index: number): FormControl {
  //   const formArray = this.ReservationForm.get('heures') as FormArray;
  //   return formArray.at(index) as FormControl;
  // }

  closeForm() {
    this.afficherForm = '';
    this.selectedReservation = null;
    this.ReservationForm.reset();
  }


  goToDashboard() {
    const userId = localStorage.getItem('userId'); // Get the user ID from local storage

    if (userId) {
      this.router.navigate(['/profil', userId]);
    }
  }
}