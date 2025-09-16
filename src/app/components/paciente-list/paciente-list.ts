import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { Paciente, PacienteService } from '../../services/paciente';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './paciente-list.html',
})
export class PacienteListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'pacientesId',
    'tipoDocumento',
    'numeroDocumento',
    'nombreCompleto',
    'fechaNacimiento',
    'correoElectronico',
    'genero',
    'direccion',
    'telefono',
    'activo',
    'fechaRegistro',
    'acciones'
  ];
  dataSource = new MatTableDataSource<Paciente>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private unsubscribe$ = new Subject<void>();

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => console.error('Error cargando pacientes', err)
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletePaciente(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      this.pacienteService.deletePaciente(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => this.loadPacientes(),
          error: (err) => console.error('Error eliminando paciente', err)
        });
    }
  }
}
