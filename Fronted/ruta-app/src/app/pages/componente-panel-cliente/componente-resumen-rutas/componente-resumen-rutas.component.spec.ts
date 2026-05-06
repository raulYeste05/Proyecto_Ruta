import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponenteResumenRutasComponent } from './componente-resumen-rutas.component';

describe('ComponenteResumenRutasComponent', () => {
  let component: ComponenteResumenRutasComponent;
  let fixture: ComponentFixture<ComponenteResumenRutasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ComponenteResumenRutasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteResumenRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
