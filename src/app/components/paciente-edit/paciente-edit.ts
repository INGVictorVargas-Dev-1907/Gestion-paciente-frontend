import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, finalize } from 'rxjs';
import { Paciente, PacienteService } from '../../services/paciente';

@Component({
  selector: 'app-paciente-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './paciente-edit.html',
  styleUrls: ['./paciente-edit.scss']
})
export class PacienteEditComponent implements OnInit, OnDestroy {
  form!: FormGroup;
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
    // 1. Inicializar el formulario SIN validadores requeridos
    this.form = this.fb.group({
      tipoDocumento: [''],
      numeroDocumento: [''],
      nombreCompleto: [''],
      fechaNacimiento: [''],
      correoElectronico: [''],
      genero: [''],
      direccion: [''],
      telefono: [''],
      activo: [true]
    });

    // 2. Obtener el ID de la URL y cargar los datos
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.pacienteId) {
      this.isLoading = true;
      this.pacienteService.getPaciente(this.pacienteId)
        .pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (paciente) => {
            // Guardar el paciente original para la comparación
            this.originalPaciente = paciente;

            // Formatear la fecha para que el input de fecha la reconozca
            if (paciente.fechaNacimiento) {
              const formattedDate = new Date(paciente.fechaNacimiento).toISOString().split('T')[0];
              this.form.patchValue({
                ...paciente,
                fechaNacimiento: formattedDate
              });
            } else {
              this.form.patchValue(paciente);
            }
          },
          error: (err) => {
            console.error('Error cargando paciente', err);
            this.snackBar.open('Error al cargar el paciente. Inténtelo de nuevo.', 'Cerrar', { duration: 3000 });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    // Si el formulario no ha sido tocado, no hay nada que hacer
    if (this.form.pristine) {
      this.snackBar.open('No se detectaron cambios para actualizar.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    // Fusionar los datos originales con los del formulario para enviar un objeto completo
    const paciente = { ...this.originalPaciente, ...this.form.value };

    // Asegurarse de que la fecha sea válida antes de formatearla
    if (paciente.fechaNacimiento) {
      const dateValue = new Date(paciente.fechaNacimiento);
      if (!isNaN(dateValue.getTime())) {
        paciente.fechaNacimiento = dateValue.toISOString().split('T')[0];
      }
    }

    this.pacienteService.updatePaciente(this.pacienteId!, paciente)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Paciente actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error actualizando', err);
          this.snackBar.open('Error al actualizar el paciente. Verifique los datos.', 'Cerrar', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
