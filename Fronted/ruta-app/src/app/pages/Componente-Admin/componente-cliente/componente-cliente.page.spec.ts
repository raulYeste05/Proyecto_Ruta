import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponenteClientePage } from './componente-cliente.page';

describe('ComponenteClientePage', () => {
  let component: ComponenteClientePage;
  let fixture: ComponentFixture<ComponenteClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
