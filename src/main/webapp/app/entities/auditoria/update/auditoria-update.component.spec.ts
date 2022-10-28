import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AuditoriaService } from '../service/auditoria.service';
import { IAuditoria, Auditoria } from '../auditoria.model';

import { AuditoriaUpdateComponent } from './auditoria-update.component';

describe('Auditoria Management Update Component', () => {
  let comp: AuditoriaUpdateComponent;
  let fixture: ComponentFixture<AuditoriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let auditoriaService: AuditoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AuditoriaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AuditoriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuditoriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    auditoriaService = TestBed.inject(AuditoriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const auditoria: IAuditoria = { id: 456 };

      activatedRoute.data = of({ auditoria });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(auditoria));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Auditoria>>();
      const auditoria = { id: 123 };
      jest.spyOn(auditoriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ auditoria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: auditoria }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(auditoriaService.update).toHaveBeenCalledWith(auditoria);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Auditoria>>();
      const auditoria = new Auditoria();
      jest.spyOn(auditoriaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ auditoria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: auditoria }));
      saveSubject.complete();

      // THEN
      expect(auditoriaService.create).toHaveBeenCalledWith(auditoria);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Auditoria>>();
      const auditoria = { id: 123 };
      jest.spyOn(auditoriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ auditoria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(auditoriaService.update).toHaveBeenCalledWith(auditoria);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
