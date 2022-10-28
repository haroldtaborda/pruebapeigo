import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CuentaDetailComponent } from './cuenta-detail.component';

describe('Cuenta Management Detail Component', () => {
  let comp: CuentaDetailComponent;
  let fixture: ComponentFixture<CuentaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ cuenta: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CuentaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CuentaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load cuenta on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.cuenta).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
