import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponenteRutasPage } from './componente-rutas.page';

describe('ComponenteRutasPage', () => {
  let component: ComponenteRutasPage;
  let fixture: ComponentFixture<ComponenteRutasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteRutasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
