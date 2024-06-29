import { Component } from '@angular/core';
import { Terrain } from '../models/terrain';
import { TerrainService } from '../services/terrain.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.css']
})
export class TerrainComponent {
  terrains: Terrain[] = [];

  constructor(private terrainsService: TerrainService,private router: Router) {}

  ngOnInit(): void {
    this.getAllTerrains();
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