import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteFormComponent } from './paciente-form';

describe('PacienteForm', () => {
  let component: PacienteFormComponent;
  let fixture: ComponentFixture<PacienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
