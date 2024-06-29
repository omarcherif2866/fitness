import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { TarifComponent } from './tarif/tarif.component';
import { ContactComponent } from './contact/contact.component';
import { ConnecterComponent } from './connecter/connecter.component';
import { ActiviteComponent } from './activite/activite.component';
import { PlanificationComponent } from './planification/planification.component';
import { AdmincoursComponent } from './admincours/admincours.component';
import { ProfileComponent } from './profile/profile.component';
import { TerrainComponent } from './terrain/terrain.component';
import { ReserverterrainComponent } from './reserverterrain/reserverterrain.component';
import { ReservationcoursComponent } from './reservationcours/reservationcours.component';
import { ReservecoachComponent } from './reservecoach/reservecoach.component';
import { ParametreComponent } from './parametre/parametre.component';
import { CoachcoursComponent } from './coachcours/coachcours.component';
import { ReservationListComponent } from './reservationlist/reservationlist.component';
import { ListreserveComponent } from './listreserve/listreserve.component';
import { ProfilComponent } from './profil/profil.component';
import { GererCompteComponent } from './gerer-compte/gerer-compte.component';
import { CoachComponent } from './coach/coach.component';
import { PlanificationCoachComponent } from './planification-coach/planification-coach.component';

const routes: Routes = [
 {path : 'home', component: HomeComponent} ,
 { path: 'registre', component: InscriptionComponent },
 {path : 'tarif' , component: TarifComponent},
 {path : 'contact' , component: ContactComponent},
 {path : 'connecter' , component: ConnecterComponent},
 {path: 'activite', component: ActiviteComponent},
 {path: 'planificationCours', component: PlanificationComponent},
 {path: 'planificationCoach', component: PlanificationCoachComponent},
 {path: 'admincours', component: AdmincoursComponent},
 {path: 'profile/:id', component: ProfileComponent},
 {path: 'terrain', component: TerrainComponent},
 {path: 'reserverterrain/:id', component: ReserverterrainComponent},
 {path: 'reservationcours/:id', component: ReservationcoursComponent},
 {path: 'reservecoach/:id', component: ReservecoachComponent},
 {path: 'coach', component: CoachComponent},
 {path: 'parametre', component: ParametreComponent},
 {path: 'coachcours', component: CoachcoursComponent},
 {path: 'listreserve', component: ListreserveComponent},
 {path: 'profil/:id', component: ProfilComponent},
 {path: 'gerercompte', component: GererCompteComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
