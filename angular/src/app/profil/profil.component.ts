import { Component } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user.models';
import { Coach, JourSemaine } from '../models/coach';
import { CoachService } from '../services/coach.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Cours } from '../models/cours';
import { CoursService } from '../services/cours.service';
import { Terrain } from '../models/terrain';
import { TerrainService } from '../services/terrain.service';
import { Reservation, Status } from '../models/reservation';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent {
  users: User[] = [];
  coachs: Coach[] = [];
  activites: Cours[] = [];
  terrains: Terrain[] = [];
  reservations: Reservation[] = [];

  CoachForm!: FormGroup; // FormGroup instance for the form
  ActiviteForm!: FormGroup; // FormGroup instance for the form
  TerrainForm!: FormGroup; // FormGroup instance for the form

  selectedCoach: Coach| null = null;

  selectedActivite: Cours| null = null;
  selectedTerrain: Terrain| null = null;
  selectedReservation:Reservation| null = null;


  displayUsers: boolean = false;

  displayCoachs: boolean = false;

  displayTerrains: boolean = false;

  displayActivites: boolean = false;

  displayReservations: boolean = false;

  pageTitle: string = '';

  afficherForm: string = '';

  statusOptions: Status[] = [Status.ACCEPTE, Status.REFUSE, Status.EN_ATTENTE];


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

  constructor(private authService: UserService, private coachsService: CoachService,private formBuilder: FormBuilder,
    private activitesService: CoursService, private terrainService: TerrainService, private reservationService: ReservationService
  ) {
    console.log('Service coachsService injecté:', this.coachsService);

  }

  ngOnInit(): void {
      this.CoachForm = this.formBuilder.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        specialite: ['', Validators.required],
        dates: this.formBuilder.array([]), // Tableau vide pour les jours
        heures: this.formBuilder.array([]), // Tableau vide pour les heures
        image: ['', Validators.required],
      });
    
      this.ActiviteForm = this.formBuilder.group({
        nom: ['', Validators.required],
        dates: this.formBuilder.array([]), // Tableau vide pour les jours
        heures: this.formBuilder.array([]), // Tableau vide pour les heures
        image: ['', Validators.required],
      });

      this.TerrainForm = this.formBuilder.group({
        nom: ['', Validators.required],
        image: ['', Validators.required],
      });


      this.initDatesFormArray();
      this.initHeuresFormArray();
      this.initDatesFormArrayActivites();
      this.initHeuresFormArrayActivites();
    this.getAllUsers();
    this.getAllCoachs();
    this.getAllActivites();
    this.getAllTerrains();
    this.getAllReservations();
    this.showUsers();
  }

  

  afficherFormulaire(form: string) {
    this.afficherForm = form;
  }

  closeForm() {
    this.afficherForm = ''; // Réinitialiser la valeur pour masquer le formulaire
    this.selectedCoach = null; // Réinitialiser la formation sélectionnée
    this.selectedActivite = null; // Réinitialiser la formation sélectionnée
    this.selectedTerrain = null; // Réinitialiser la formation sélectionnée
    this.CoachForm.reset(); // Réinitialiser les champs du formulaire
    this.ActiviteForm.reset(); // Réinitialiser les champs du formulaire
    this.TerrainForm.reset(); // Réinitialiser les champs du formulaire

  }

  showUsers() {
    this.displayUsers = true;
    this.displayTerrains = false;
    this.displayCoachs = false;
    this.displayActivites = false
    this.displayReservations = false

    this.pageTitle = 'Tous les Utilisateurs';
  }
  showTerrains() {
    this.displayUsers = false;
    this.displayTerrains = true;
    this.displayCoachs = false;
    this.displayActivites = false
    this.displayReservations = false

    this.pageTitle = 'Terrains';
  }
  showCoachs() {
    this.displayUsers = false;
    this.displayTerrains = false;
    this.displayCoachs = true;
    this.displayActivites = false
    this.displayReservations = false

    this.pageTitle = 'Coachs';
  }
  showActivites() {
    this.displayUsers = false;
    this.displayTerrains = false;
    this.displayCoachs = false;
    this.displayActivites = true
    this.displayReservations = false

    this.pageTitle = 'Activites';
  }
  showReservations() {
    this.displayUsers = false;
    this.displayTerrains = false;
    this.displayCoachs = false;
    this.displayActivites = false
    this.displayReservations = true
    this.pageTitle = 'Reservations';
  }

  //--------------------------users-------------------------------------------------
  getAllUsers(): void {
    this.authService.getAllUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        console.log('Utilisateurs récupérés avec succès', this.users);
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  blockUser(userId: number): void {
    this.authService.blockUser(userId).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Vous avez bloquer cet utilisateur',
          showConfirmButton: false,
          timer: 1500
        })
        // console.log('User blocked successfully.');
        // Actualiser la liste des utilisateurs après le blocage
        this.getAllUsers();
      },
      (error) => {
        console.error('Error blocking user:', error);
      }
    );
  }

  unblockUser(userId: number): void {
    this.authService.unblockUser(userId).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Vous avez débloquer cet utilisateur',
          showConfirmButton: false,
          timer: 1500
        })
        // console.log('User unblocked successfully.');
        // Actualiser la liste des utilisateurs après le déblocage
        this.getAllUsers();
      },
      (error) => {
        console.error('Error unblocking user:', error);
      }
    );
  }

  //--------------------------coachs-------------------------------------------------
  getAllCoachs(): void {
    this.coachsService.getAllCoach().subscribe(
      (response: Coach[]) => {
        this.coachs = response;
        console.log('Coach récupérés avec succès', this.coachs);
      },
      (error) => {
        console.error('Erreur lors de la récupération des Coach', error);
      }
    );
  }

  saveOrUpdate(): void {
    if (this.CoachForm.valid) {
      const selectedDates: string[] = [];
      const selectedHeures: string[] = [];
  
      // Récupérer les dates sélectionnées
      this.joursSemaine.forEach((jour, index) => {
        if (this.getDateControl(index).value) {
          selectedDates.push(jour);
        }
      });
  
      // Récupérer les heures sélectionnées
      this.joursHeure.forEach((heure, index) => {
        if (this.getHeureControl(index).value) {
          selectedHeures.push(heure);
        }
      });
  
      // Construction des données du coach
      const formData = new FormData();
      formData.append('nom', this.CoachForm.value.nom);
      formData.append('prenom', this.CoachForm.value.prenom);
      formData.append('specialite', this.CoachForm.value.specialite);
      formData.append('image', this.CoachForm.value.image);
  
      // Ajouter les dates et les heures sélectionnées au formData
      selectedDates.forEach(date => formData.append('dates', date));
      selectedHeures.forEach(heure => formData.append('heures', heure));
  
      console.log('Données du coach:', formData);
  
      if (this.selectedCoach) {
        console.log('Mise à jour du coach avec ID:', this.selectedCoach.id);
        this.updateCoach(this.selectedCoach.id, formData);
      } else {
        console.log('Ajout d\'un nouveau coach...');
        this.addCoach(formData);
      }
    } else {
      console.log('Formulaire invalide. Veuillez vérifier les champs requis.');
    }
  }

  updateCoach(id: any, coachData: any) {
    console.log('Méthode saveOrUpdate() appelée');

    this.coachsService.updateCoach(id, coachData).subscribe(
      res => {
        // console.log('Coach mise à jour avec succès');
        Swal.fire({
          icon: 'success',
          title: 'Coach mise à jour avec succès',
          showConfirmButton: false,
          timer: 1500
        })

      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la mise à jour du Coach',
          showConfirmButton: false,
          timer: 1500
        })
        // console.error('Erreur lors de la mise à jour du Coach:', error);
      }
    );
  }

  editCoach(coach: Coach) {
    this.selectedCoach = coach; // Sélectionner le coach pour la modification
    this.afficherForm = 'createForm'; // Afficher le formulaire de création/modification
  
    // Clear existing controls in dates and heures FormArray
    (this.CoachForm.get('dates') as FormArray).clear();
    (this.CoachForm.get('heures') as FormArray).clear();
  
    // Patch other form controls
    this.CoachForm.patchValue({
      nom: coach.nom,
      prenom: coach.prenom,
      specialite: coach.specialite,
      image: coach.image
    });
  
    // Ensure dates and heures are arrays
    const coachDates: JourSemaine[] = coach.dates || [];
    const coachHeures: string[] = coach.heures || [];
  
    // Add new controls to dates FormArray
    this.joursSemaine.forEach((jour) => {
      const control = new FormControl(coachDates.includes(jour));
      (this.CoachForm.get('dates') as FormArray).push(control);
    });
  
    // Add new controls to heures FormArray
    this.joursHeure.forEach((heure) => {
      const control = new FormControl(coachHeures.includes(heure));
      (this.CoachForm.get('heures') as FormArray).push(control);
    });
  }

  deleteCoach(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce Coach ?')) {
      this.coachsService.deleteCoach(id).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Coach supprimée avec succès',
            showConfirmButton: false,
            timer: 1500
          })
          // console.log('Coach supprimée avec succès');
          this.getAllCoachs(); // Mettre à jour la liste des Coachs après la suppression
        },
        error => {
          
          console.error('Erreur lors de la suppression du Coach:', error);
        }
      );
    }
  }

  addCoach(coachData: any) {
    this.coachsService.addCoach(coachData).subscribe(
      res => {
        Swal.fire({
          icon: 'success',
          title: 'Coach ajouté avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.closeForm(); // Fermer le formulaire après l'ajout
        this.getAllCoachs(); // Mettre à jour la liste des coachs après l'ajout
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de l\'ajout du coach',
          text: error.message, // Afficher le message d'erreur du backend s'il y en a un
          showConfirmButton: true // Afficher le bouton de confirmation pour permettre à l'utilisateur de fermer la notification
        });
        console.error('Erreur lors de l\'ajout du coach:', error);
      }
    );
  }
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.CoachForm.patchValue({
        image: file
      });
    }
  }

  initDatesFormArray() {
    const formArray = this.CoachForm.get('dates') as FormArray;
    this.joursSemaine.forEach(() => formArray.push(new FormControl(false)));
  }

  initHeuresFormArray() {
    const formArray = this.CoachForm.get('heures') as FormArray;
    this.joursHeure.forEach(() => formArray.push(new FormControl(false)));
  }

  getDatesControls(): AbstractControl[] {
    const formArray = this.CoachForm.get('dates') as FormArray;
    return formArray.controls;
  }

  getHeuresControls(): AbstractControl[] {
    const formArray = this.CoachForm.get('heures') as FormArray;
    return formArray.controls;
  }

  getDateControl(index: number): FormControl {
    const formArray = this.CoachForm.get('dates') as FormArray;
    return formArray.at(index) as FormControl;
  }

  getHeureControl(index: number): FormControl {
    const formArray = this.CoachForm.get('heures') as FormArray;
    return formArray.at(index) as FormControl;
  }



    //--------------------------Activites-------------------------------------------------
    getAllActivites(): void {
      this.activitesService.getAllCours().subscribe(
        (response: Cours[]) => {
          this.activites = response;
          console.log('activites récupérés avec succès', this.activites);
        },
        (error) => {
          console.error('Erreur lors de la récupération des activites', error);
        }
      );
    }
  
    saveOrUpdateActivites(): void {
      if (this.ActiviteForm.valid) {
        const selectedDates: string[] = [];
        const selectedHeures: string[] = [];
    
        // Récupérer les dates sélectionnées
        this.joursSemaine.forEach((jour, index) => {
          if (this.getDateControlActivites(index).value) {
            selectedDates.push(jour);
          }
        });
    
        // Récupérer les heures sélectionnées
        this.joursHeure.forEach((heure, index) => {
          if (this.getHeureControlActivites(index).value) {
            selectedHeures.push(heure);
          }
        });
    
        // Construction des données du cours
        const formData = new FormData();
        formData.append('nom', this.ActiviteForm.value.nom);
        formData.append('image', this.ActiviteForm.value.image);
    
        // Ajouter les dates et les heures sélectionnées au formData
        selectedDates.forEach(date => formData.append('dates', date));
        selectedHeures.forEach(heure => formData.append('heures', heure));
    
        console.log('Données du cours:', formData);
    
        if (this.selectedActivite) {
          console.log('Mise à jour du cours avec ID:', this.selectedActivite.id);
          this.updateActivites(this.selectedActivite.id, formData);
        } else {
          console.log('Ajout d\'un nouveau cours...');
          this.addActivites(formData);
          console.log('Données du cours:', formData);
        }
      } else {
        console.log('Formulaire invalide. Veuillez vérifier les champs requis.');
      }
    }
    
  
    updateActivites(id: any, activiteData: any) {
      console.log('Méthode saveOrUpdateActivites() appelée');
  
      this.activitesService.updateCours(id, activiteData).subscribe(
        res => {
          // console.log('Coach mise à jour avec succès');
          Swal.fire({
            icon: 'success',
            title: 'Activite mise à jour avec succès',
            showConfirmButton: false,
            timer: 1500
          })
  
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de la mise à jour de l\'activite',
            showConfirmButton: false,
            timer: 1500
          })
          // console.error('Erreur lors de la mise à jour du Coach:', error);
        }
      );
    }
  
    editActivites(activite: Cours) {
      this.selectedActivite = activite; // Sélectionner le coach pour la modification
      this.afficherForm = 'createForm'; // Afficher le formulaire de création/modification
    
      // Clear existing controls in dates and heures FormArray
      (this.ActiviteForm.get('dates') as FormArray).clear();
      (this.ActiviteForm.get('heures') as FormArray).clear();
    
      // Patch other form controls
      this.ActiviteForm.patchValue({
        nom: activite.nom,
        image: activite.image
      });
    
      // Ensure dates and heures are arrays
      const activiteDates: JourSemaine[] = activite.dates || [];
      const activiteHeures: string[] = activite.heures || [];
    
      // Add new controls to dates FormArray
      this.joursSemaine.forEach((jour) => {
        const control = new FormControl(activiteDates.includes(jour));
        (this.ActiviteForm.get('dates') as FormArray).push(control);
      });
    
      // Add new controls to heures FormArray
      this.joursHeure.forEach((heure) => {
        const control = new FormControl(activiteHeures.includes(heure));
        (this.ActiviteForm.get('heures') as FormArray).push(control);
      });
    }
  
    deleteActivites(id: any) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette activite ?')) {
        this.activitesService.deleteCours(id).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'activité supprimée avec succès',
              showConfirmButton: false,
              timer: 1500
            })
            // console.log('Coach supprimée avec succès');
            this.getAllActivites(); // Mettre à jour la liste des Coachs après la suppression
          },
          error => {
            
            console.error('Erreur lors de la suppression de l\'activité:', error);
          }
        );
      }
    }
  
    addActivites(activiteData: any) {
      this.activitesService.addCours(activiteData).subscribe(
        res => {
          Swal.fire({
            icon: 'success',
            title: 'Activité ajoutée avec succès',
            showConfirmButton: false,
            timer: 1500
          });
          this.closeForm(); // Fermer le formulaire après l'ajout
          this.getAllActivites(); // Mettre à jour la liste des coachs après l'ajout
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de l\'ajout de l\'activité',
            text: error.message, // Afficher le message d'erreur du backend s'il y en a un
            showConfirmButton: true // Afficher le bouton de confirmation pour permettre à l'utilisateur de fermer la notification
          });
          console.error('Erreur lors de l\'ajout de l\'activité:', error);
        }
      );
    }
    
    onFileSelectedActivites(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
        this.ActiviteForm.patchValue({
          image: file
        });
      }
    }
  
    initDatesFormArrayActivites() {
      const formArray = this.ActiviteForm.get('dates') as FormArray;
      this.joursSemaine.forEach(() => formArray.push(new FormControl(false)));
    }
  
    initHeuresFormArrayActivites() {
      const formArray = this.ActiviteForm.get('heures') as FormArray;
      this.joursHeure.forEach(() => formArray.push(new FormControl(false)));
    }
  
    getDatesControlsActivites(): AbstractControl[] {
      const formArray = this.ActiviteForm.get('dates') as FormArray;
      return formArray.controls;
    }
  
    getHeuresControlsActivites(): AbstractControl[] {
      const formArray = this.ActiviteForm.get('heures') as FormArray;
      return formArray.controls;
    }
  
    getDateControlActivites(index: number): FormControl {
      const formArray = this.ActiviteForm.get('dates') as FormArray;
      return formArray.at(index) as FormControl;
    }
  
    getHeureControlActivites(index: number): FormControl {
      const formArray = this.ActiviteForm.get('heures') as FormArray;
      return formArray.at(index) as FormControl;
    }


//--------------------------terrain-------------------------------------------------

getAllTerrains(): void {
  this.terrainService.getAllTerrain().subscribe(
    (response: Terrain[]) => {
      this.terrains = response;
      console.log('terrains récupérés avec succès', this.terrains);
    },
    (error) => {
      console.error('Erreur lors de la récupération des terrains', error);
    }
  );
}

  saveOrUpdateTerrains(): void {
    if (this.TerrainForm.valid) {
  
      // Construction des données du terrain
      const formData = new FormData();
      formData.append('nom', this.TerrainForm.value.nom);
      formData.append('image', this.TerrainForm.value.image);
    
      console.log('Données du terrain:', formData);
  
      if (this.selectedTerrain) {
        console.log('Mise à jour du terrain avec ID:', this.selectedTerrain.id);
        this.updatedTerrain(this.selectedTerrain.id, formData);
      } else {
        console.log('Ajout d\'un nouveau terrain...');
        this.addTerrain(formData);
      }
    } else {
      console.log('Formulaire invalide. Veuillez vérifier les champs requis.');
    }
  }

  updatedTerrain(id: any, terrainData: any) {
    console.log('Méthode saveOrUpdateTerrains() appelée');

    this.terrainService.updateTerrain(id, terrainData).subscribe(
      res => {
        // console.log('Coach mise à jour avec succès');
        Swal.fire({
          icon: 'success',
          title: 'Terrain mise à jour avec succès',
          showConfirmButton: false,
          timer: 1500
        })

      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la mise à jour du terrain',
          showConfirmButton: false,
          timer: 1500
        })
        // console.error('Erreur lors de la mise à jour du Coach:', error);
      }
    );
  }

  editTerrains(terrain: Terrain) {
    this.selectedTerrain = terrain; // Sélectionner le coach pour la modification
    this.afficherForm = 'createForm'; // Afficher le formulaire de création/modification
    this.TerrainForm.patchValue({
      nom: terrain.nom,
      image: terrain.image
    });

  }

  deleteTerrains(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce terrain ?')) {
      this.terrainService.deleteTerrain(id).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Terrain supprimé avec succès',
            showConfirmButton: false,
            timer: 1500
          })
          // console.log('Coach supprimée avec succès');
          this.getAllTerrains(); // Mettre à jour la liste des Coachs après la suppression
        },
        error => {
          
          console.error('Erreur lors de la suppression du terrain:', error);
        }
      );
    }
  }

  addTerrain(terrainData: any) {
    this.terrainService.addTerrain(terrainData).subscribe(
      res => {
        Swal.fire({
          icon: 'success',
          title: 'Terrain ajouté avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.closeForm(); // Fermer le formulaire après l'ajout
        this.getAllTerrains(); // Mettre à jour la liste des coachs après l'ajout
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de l\'ajout du Terrain',
          text: error.message, // Afficher le message d'erreur du backend s'il y en a un
          showConfirmButton: true // Afficher le bouton de confirmation pour permettre à l'utilisateur de fermer la notification
        });
        console.error('Erreur lors de l\'ajout du Terrain:', error);
      }
    );
  }
  
  onFileSelectedTerrains(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.TerrainForm.patchValue({
        image: file
      });
    }
  }



  //--------------------------reservation-------------------------------------------------



  getAllReservations(): void {
    this.reservationService.getAllReservation().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
      },
      (error) => {
        console.error('Error fetching reservations:', error);
      }
    );
  }


  
  updateReservationStatus(reservation: Reservation): void {
    this.reservationService.updateReservationStatus(reservation.id, reservation.status).subscribe(
      updatedReservation => {
        // Find the reservation in the list and update it
        const index = this.reservations.findIndex(r => r.id === updatedReservation.id);
        if (index !== -1) {
          this.reservations[index] = updatedReservation;
        }
        Swal.fire({
          icon: 'success',
          title: 'Status est mis a jour ',
          showConfirmButton: false,
          timer: 1500
        });
        this.closeForm(); // Fermer le formulaire après l'ajout
        this.getAllTerrains(); // Mettre à jour la liste des coachs après l'ajout
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la mise a jour du status',
          text: error.message, // Afficher le message d'erreur du backend s'il y en a un
          showConfirmButton: true // Afficher le bouton de confirmation pour permettre à l'utilisateur de fermer la notification
        });
      }
    );
  }
  
}