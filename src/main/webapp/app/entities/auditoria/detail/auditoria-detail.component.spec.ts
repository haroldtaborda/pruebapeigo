import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuditoriaDetailComponent } from './auditoria-detail.component';

describe('Auditoria Management Detail Component', () => {
  let comp: AuditoriaDetailComponent;
  let fixture: ComponentFixture<AuditoriaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditoriaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ auditoria: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AuditoriaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AuditoriaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load auditoria on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.auditoria).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
