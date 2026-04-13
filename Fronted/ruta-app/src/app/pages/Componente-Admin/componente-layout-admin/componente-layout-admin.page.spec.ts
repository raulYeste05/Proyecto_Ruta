import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponenteLayoutAdminPage } from './componente-layout-admin.page';

describe('ComponenteLayoutAdminPage', () => {
  let component: ComponenteLayoutAdminPage;
  let fixture: ComponentFixture<ComponenteLayoutAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponenteLayoutAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
