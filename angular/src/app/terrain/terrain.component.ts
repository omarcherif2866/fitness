import { Component } from '@angular/core';
import { Terrain } from '../models/terrain';
import { TerrainService } from '../services/terrain.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.css']
})
export class TerrainComponent {
  terrains: Terrain[] = [];
  isLoggedIn: boolean = false;

  constructor(private terrainsService: TerrainService,private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllTerrains();
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  
  getAllTerrains(): void {
  this.terrainsService.getAllTerrain().subscribe(
    (response: Terrain[]) => {
      this.terrains = response;
      console.log('Coach récupérés avec succès', this.terrains);
    },
    (error) => {
      console.error('Erreur lors de la récupération des Coach', error);
    }
  );
}

getImageUrl(imageName: string): string {
  return `http://localhost:8090/terrain/image/${imageName}`;
}

reserve(terrainId: number) {
  this.router.navigate(['/reserverterrain/', terrainId]);
}
}