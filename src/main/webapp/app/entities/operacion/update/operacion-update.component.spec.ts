import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OperacionService } from '../service/operacion.service';
import { IOperacion, Operacion } from '../operacion.model';
import { IAuditoria } from 'app/entities/auditoria/auditoria.model';
import { AuditoriaService } from 'app/entities/auditoria/service/auditoria.service';

import { OperacionUpdateComponent } from './operacion-update.component';

describe('Operacion Management Update Component', () => {
  let comp: OperacionUpdateComponent;
  let fixture: ComponentFixture<OperacionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let operacionService: OperacionService;
  let auditoriaService: AuditoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OperacionUpdateComponent],
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
      .overrideTemplate(OperacionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OperacionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    operacionService = TestBed.inject(OperacionService);
    auditoriaService = TestBed.inject(AuditoriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call auditoria query and add missing value', () => {
      const operacion: IOperacion = { id: 456 };
      const auditoria: IAuditoria = { id: 29015 };
      operacion.auditoria = auditoria;

      const auditoriaCollection: IAuditoria[] = [{ id: 85726 }];
      jest.spyOn(auditoriaService, 'query').mockReturnValue(of(new HttpResponse({ body: auditoriaCollection })));
      const expectedCollection: IAuditoria[] = [auditoria, ...auditoriaCollection];
      jest.spyOn(auditoriaService, 'addAuditoriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ operacion });
      comp.ngOnInit();

      expect(auditoriaService.query).toHaveBeenCalled();
      expect(auditoriaService.addAuditoriaToCollectionIfMissing).toHaveBeenCalledWith(auditoriaCollection, auditoria);
      expect(comp.auditoriasCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const operacion: IOperacion = { id: 456 };
      const auditoria: IAuditoria = { id: 7456 };
      operacion.auditoria = auditoria;

      activatedRoute.data = of({ operacion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(operacion));
      expect(comp.auditoriasCollection).toContain(auditoria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Operacion>>();
      const operacion = { id: 123 };
      jest.spyOn(operacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operacion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(operacionService.update).toHaveBeenCalledWith(operacion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Operacion>>();
      const operacion = new Operacion();
      jest.spyOn(operacionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operacion }));
      saveSubject.complete();

      // THEN
      expect(operacionService.create).toHaveBeenCalledWith(operacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Operacion>>();
      const operacion = { id: 123 };
      jest.spyOn(operacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(operacionService.update).toHaveBeenCalledWith(operacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAuditoriaById', () => {
      it('Should return tracked Auditoria primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAuditoriaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
