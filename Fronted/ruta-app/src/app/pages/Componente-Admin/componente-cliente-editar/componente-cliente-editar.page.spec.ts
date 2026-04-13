import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponenteClienteEditarPage } from './componente-cliente-editar.page';

describe('ComponenteClienteEditarPage', () => {
  let component: ComponenteClienteEditarPage;
  let fixture: ComponentFixture<ComponenteClienteEditarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteClienteEditarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
