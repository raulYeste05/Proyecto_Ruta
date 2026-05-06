import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentePerfilComponent } from './componente-perfil.component';

describe('ComponentePerfilComponent', () => {
  let component: ComponentePerfilComponent;
  let fixture: ComponentFixture<ComponentePerfilComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ComponentePerfilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentePerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
