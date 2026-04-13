import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentePanelAdminPage } from './componente-panel-admin.page';

describe('ComponentePanelAdminPage', () => {
  let component: ComponentePanelAdminPage;
  let fixture: ComponentFixture<ComponentePanelAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentePanelAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
