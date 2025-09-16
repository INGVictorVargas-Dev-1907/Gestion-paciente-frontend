import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Paciente, PacienteService } from '../../services/paciente';
import { Subject, takeUntil, finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatCheckboxModule
  ],
  templateUrl: './paciente-form.html'
})
export class PacienteFormComponent implements OnInit, OnDestroy {
  pacienteForm!: FormGroup;
  editMode = false;
  pacienteId?: number;
  isLoading = false;
  private unsubscribe$ = new Subject<void>();
  private originalPaciente!: Paciente;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
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

    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.pacienteId = +params['id'];
        this.loadPaciente(this.pacienteId);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadPaciente(id: number): void {
    this.isLoading = true;
    this.pacienteService.getPaciente(id)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (paciente) => {
          this.originalPaciente = paciente; // Guardar el paciente original

          // Formatear la fecha para que el input type="date" la reconozca
          const formattedDate = new Date(paciente.fechaNacimiento).toISOString().split('T')[0];
          this.pacienteForm.patchValue({
            ...paciente,
            fechaNacimiento: formattedDate
          });
        },
        error: (err) => {
          console.error('Error cargando paciente', err);
          this.snackBar.open('Error al cargar el paciente. Inténtelo de nuevo.', 'Cerrar', { duration: 3000 });
        }
      });
  }

  onSubmit(): void {
    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Fusionar los datos originales con los del formulario
    const paciente = {
      ...this.originalPaciente,
      ...this.pacienteForm.value
    };

    // Formatear la fecha antes de enviar
    if (paciente.fechaNacimiento) {
      paciente.fechaNacimiento = new Date(paciente.fechaNacimiento).toISOString().split('T')[0];
    }

    let request$;
    if (this.editMode && this.pacienteId) {
      request$ = this.pacienteService.updatePaciente(this.pacienteId, paciente);
    } else {
      request$ = this.pacienteService.createPaciente(paciente);
    }

    request$.pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.snackBar.open(`Paciente ${this.editMode ? 'actualizado' : 'creado'} con éxito`, 'Cerrar', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al guardar paciente', err);
        this.snackBar.open(`Error al ${this.editMode ? 'actualizar' : 'crear'} el paciente.`, 'Cerrar', { duration: 3000 });
      }
    });
  }
}
