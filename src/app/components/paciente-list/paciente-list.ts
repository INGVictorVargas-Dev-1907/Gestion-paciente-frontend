import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Paciente, PacienteService } from '../../services/paciente';

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
  styleUrls: ['./paciente-list.scss']
})
export class PacienteListComponent implements OnInit {
  displayedColumns: string[] = ['nombreCompleto', 'correoElectronico', 'telefono', 'acciones'];
  pacientes: Paciente[] = [];

  // ✅ Aquí declaramos pacienteService para que Angular lo inyecte
  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => (this.pacientes = data),
      error: (err) => console.error('Error cargando pacientes', err)
    });
  }

  deletePaciente(id: number): void {
    this.pacienteService.deletePaciente(id).subscribe({
      next: () => this.loadPacientes(),
      error: (err) => console.error('Error eliminando paciente', err)
    });
  }
}