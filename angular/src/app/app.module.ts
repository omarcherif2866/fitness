import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { TarifComponent } from './tarif/tarif.component';
import { ContactComponent } from './contact/contact.component';
import { HttpClientModule } from '@angular/common/http';

import { ConnecterComponent } from './connecter/connecter.component';
import { ActiviteComponent } from './activite/activite.component';
import { PlanificationComponent } from './planification/planification.component';
import { AdmincoursComponent } from './admincours/admincours.component';
import { ProfileComponent } from './profile/profile.component';
import { TerrainComponent } from './terrain/terrain.component';
import { ReserverterrainComponent } from './reserverterrain/reserverterrain.component';
import { ReservationcoursComponent } from './reservationcours/reservationcours.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParametreComponent } from './parametre/parametre.component';
import { ReservecoachComponent } from './reservecoach/reservecoach.component';
import { CoachcoursComponent } from './coachcours/coachcours.component';
import { ReservationListComponent } from './reservationlist/reservationlist.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { ListreserveComponent } from './listreserve/listreserve.component';
import { NavbComponent } from './navb/navb.component';
import { ProfilComponent } from './profil/profil.component';
import { GererCompteComponent } from './gerer-compte/gerer-compte.component';
import { CoachComponent } from './coach/coach.component';
import { PlanificationCoachComponent } from './planification-coach/planification-coach.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InscriptionComponent,
    TarifComponent,
    ContactComponent,
    ConnecterComponent,
    ActiviteComponent,
    PlanificationComponent,
    AdmincoursComponent,
    ProfileComponent,
    TerrainComponent,
    ReserverterrainComponent,
    ReservationcoursComponent,
    ParametreComponent,
    ReservecoachComponent,
    CoachcoursComponent,
    ReservationListComponent,
    NavbarComponent,
    FooterComponent,
    NavComponent,
    ListreserveComponent,
    NavbComponent,
    ProfilComponent,
    GererCompteComponent,
    CoachComponent,
    PlanificationCoachComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,FormsModule,ReactiveFormsModule,HttpClientModule,FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
