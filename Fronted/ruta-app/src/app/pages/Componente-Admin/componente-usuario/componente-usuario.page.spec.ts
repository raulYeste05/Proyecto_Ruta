import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponenteUsuarioPage } from './componente-usuario.page';

describe('ComponenteUsuarioPage', () => {
  let component: ComponenteUsuarioPage;
  let fixture: ComponentFixture<ComponenteUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
