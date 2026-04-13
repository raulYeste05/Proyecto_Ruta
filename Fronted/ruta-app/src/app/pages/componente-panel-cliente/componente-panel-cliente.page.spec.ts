import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentePanelClientePage } from './componente-panel-cliente.page';

describe('ComponentePanelClientePage', () => {
  let component: ComponentePanelClientePage;
  let fixture: ComponentFixture<ComponentePanelClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentePanelClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
