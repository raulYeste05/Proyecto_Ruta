import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponenteMapaRutasComponent } from './componente-mapa-rutas.component';

describe('ComponenteMapaRutasComponent', () => {
  let component: ComponenteMapaRutasComponent;
  let fixture: ComponentFixture<ComponenteMapaRutasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ComponenteMapaRutasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteMapaRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
