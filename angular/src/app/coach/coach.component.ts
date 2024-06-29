import { Component } from '@angular/core';
import { Coach } from '../models/coach';
import { CoachService } from '../services/coach.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent {
  coachs: Coach[] = [];

  constructor(private coachsService: CoachService,private router: Router) {}

  ngOnInit(): void {
    this.getAllCoachs();
  }

  
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

getImageUrl(imageName: string): string {
  return `http://localhost:8090/coach/image/${imageName}`;
}

reserve(coachId: number) {
  this.router.navigate(['/reservecoach/', coachId]);
}
}
