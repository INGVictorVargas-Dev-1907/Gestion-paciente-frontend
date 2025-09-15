import { Routes } from '@angular/router';
import { PacienteList } from './components/paciente-list/paciente-list';
import { PacienteFormComponent } from './components/paciente-form/paciente-form';

export const routes: Routes = [
  { path: '', component: PacienteList },
  { path: 'nuevo', component: PacienteFormComponent },
  { path: '**', redirectTo: ''},
];
