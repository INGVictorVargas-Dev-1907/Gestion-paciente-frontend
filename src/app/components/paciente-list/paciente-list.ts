import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Paciente } from '../../services/paciente';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './paciente-list.html',
  styleUrl: './paciente-list.scss'
})
export class PacienteList implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'documento', 'coreo','acciones'];
  pacientes: Paciente[] = [];

  constructor(private pacienteService: Paciente ) { }

  ngOnInit(): void {
      this.loadPacientes();
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes().subscribe(data => (this.pacientes = data));
  }

  deletePaciente(id: number): void {
    this.pacienteService.deletePaciente(id).subscribe(() => this.loadPacientes());
  }
}
