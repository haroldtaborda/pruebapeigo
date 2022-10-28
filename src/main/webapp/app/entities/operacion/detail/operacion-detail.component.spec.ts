import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OperacionDetailComponent } from './operacion-detail.component';

describe('Operacion Management Detail Component', () => {
  let comp: OperacionDetailComponent;
  let fixture: ComponentFixture<OperacionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperacionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ operacion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OperacionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OperacionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load operacion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.operacion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
