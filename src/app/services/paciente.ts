import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Paciente {
  pacientesId?: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  correoElectronico: string;
  genero: string;
  direccion?: string;
  telefono?: string;
  activo: boolean;
  fechaRegistro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'https://localhost:7121/api/Hospital';

  constructor(private http: HttpClient) {}

  /** Obtener todos los pacientes */
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  /** Obtener un paciente por id */
  getPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  /** Crear un paciente */
  createPaciente(paciente: Paciente): Observable<Paciente> {
    // 👇 se corrige la ruta para coincidir con [HttpPost("guardar")] en el backend
    return this.http.post<Paciente>(`${this.apiUrl}/guardar`, paciente);
  }

  /** Actualizar un paciente existente */
  updatePaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  /** Eliminar un paciente existente */
  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}