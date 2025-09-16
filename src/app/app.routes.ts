import { Routes } from '@angular/router';
import { PacienteListComponent } from './components/paciente-list/paciente-list';
import { PacienteFormComponent } from './components/paciente-form/paciente-form';

export const routes: Routes = [
  { path: '', component: PacienteListComponent },
  { path: 'nuevo', component: PacienteFormComponent },
  { path: '**', redirectTo: ''},
];
