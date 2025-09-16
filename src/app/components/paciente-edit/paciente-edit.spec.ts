import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEdit } from './paciente-edit';

describe('PacienteEdit', () => {
  let component: PacienteEdit;
  let fixture: ComponentFixture<PacienteEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
