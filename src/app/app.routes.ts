import { Routes } from '@angular/router';
import { PacienteListComponent } from './components/paciente-list/paciente-list';
import { PacienteFormComponent } from './components/paciente-form/paciente-form';
import { PacienteEditComponent } from './components/paciente-edit/paciente-edit';

export const routes: Routes = [
  { path: '', component: PacienteListComponent },
  { path: 'nuevo', component: PacienteFormComponent },
  { path: 'editar/:id', component: PacienteEditComponent },
  { path: '**', redirectTo: ''},
];
