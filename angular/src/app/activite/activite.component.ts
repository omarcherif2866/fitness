import { Component } from '@angular/core';
import { Cours } from '../models/cours';
import { CoursService } from '../services/cours.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activite',
  templateUrl: './activite.component.html',
  styleUrls: ['./activite.component.css']
})
export class ActiviteComponent {
   courss: Cours[] = [];

   constructor(private coursService: CoursService,private router: Router) {}
 
   ngOnInit(): void {
     this.getAllCours();
   }

   
   getAllCours(): void {
   this.coursService.getAllCours().subscribe(
     (response: Cours[]) => {
       this.courss = response;
       console.log('Cours récupérés avec succès', this.courss);
     },
     (error) => {
       console.error('Erreur lors de la récupération des cours', error);
     }
   );
 }

 getImageUrl(imageName: string): string {
   return `http://localhost:8090/cours/image/${imageName}`;
 }

 chunkArray(array: any[], chunkSize: number): any[][] {
   const chunks = [];
   for (let i = 0; i < array.length; i += chunkSize) {
     chunks.push(array.slice(i, i + chunkSize));
   }
   return chunks;
 }

 reserve(coursId: number) {
  // Redirigez l'utilisateur vers ReservationcoursComponent avec l'ID du cours
  this.router.navigate(['/reservationcours/', coursId]);
}

 
}
