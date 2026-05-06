import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponenteInicioComponent } from './componente-inicio.component';

describe('ComponenteInicioComponent', () => {
  let component: ComponenteInicioComponent;
  let fixture: ComponentFixture<ComponenteInicioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ComponenteInicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
