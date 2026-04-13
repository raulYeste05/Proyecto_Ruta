import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponenteClienteNuevoPage } from './componente-cliente-nuevo.page';

describe('ComponenteClienteNuevoPage', () => {
  let component: ComponenteClienteNuevoPage;
  let fixture: ComponentFixture<ComponenteClienteNuevoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteClienteNuevoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
