import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './paciente-form.html'
})
export class PacienteFormComponent implements OnInit {
  pacienteForm!: FormGroup;
  editMode = false;
  pacienteId?: number;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService, // ✅ aquí cambiamos
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
    this.pacienteForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      genero: ['', Validators.required],
      direccion: [''],
      telefono: [''],
      activo: [true]
    });

    // Detectar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.pacienteId = +params['id'];
        this.loadPaciente(this.pacienteId);
      }
    });
  }

  /** Cargar datos de un paciente en el formulario */
  loadPaciente(id: number): void {
    this.pacienteService.getPaciente(id).subscribe(paciente => {
      this.pacienteForm.patchValue(paciente);
    });
  }

  /** Crear o actualizar paciente */
  onSubmit(): void {
  if (this.pacienteForm.invalid) return;

  // Quitar el ID si existe (lo maneja el backend)
  const { pacientesId, ...paciente } = this.pacienteForm.getRawValue();

  // Formatear fechaNacimiento a YYYY-MM-DD
  paciente.fechaNacimiento = new Date(paciente.fechaNacimiento).toISOString().split('T')[0];

  if (this.editMode && this.pacienteId) {
    this.pacienteService.updatePaciente(this.pacienteId, paciente).subscribe(() => {
      this.router.navigate(['/']);
    });
  } else {
    this.pacienteService.createPaciente(paciente).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}

}