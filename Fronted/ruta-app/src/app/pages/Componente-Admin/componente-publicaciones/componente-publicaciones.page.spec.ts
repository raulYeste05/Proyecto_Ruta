import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentePublicacionesPage } from './componente-publicaciones.page';

describe('ComponentePublicacionesPage', () => {
  let component: ComponentePublicacionesPage;
  let fixture: ComponentFixture<ComponentePublicacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentePublicacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
