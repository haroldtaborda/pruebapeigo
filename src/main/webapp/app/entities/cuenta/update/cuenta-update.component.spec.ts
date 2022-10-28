import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CuentaService } from '../service/cuenta.service';
import { ICuenta, Cuenta } from '../cuenta.model';
import { IAuditoria } from 'app/entities/auditoria/auditoria.model';
import { AuditoriaService } from 'app/entities/auditoria/service/auditoria.service';

import { CuentaUpdateComponent } from './cuenta-update.component';

describe('Cuenta Management Update Component', () => {
  let comp: CuentaUpdateComponent;
  let fixture: ComponentFixture<CuentaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cuentaService: CuentaService;
  let auditoriaService: AuditoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CuentaUpdateComponent],
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
      .overrideTemplate(CuentaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CuentaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cuentaService = TestBed.inject(CuentaService);
    auditoriaService = TestBed.inject(AuditoriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call auditoria query and add missing value', () => {
      const cuenta: ICuenta = { id: 456 };
      const auditoria: IAuditoria = { id: 10322 };
      cuenta.auditoria = auditoria;

      const auditoriaCollection: IAuditoria[] = [{ id: 9662 }];
      jest.spyOn(auditoriaService, 'query').mockReturnValue(of(new HttpResponse({ body: auditoriaCollection })));
      const expectedCollection: IAuditoria[] = [auditoria, ...auditoriaCollection];
      jest.spyOn(auditoriaService, 'addAuditoriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ cuenta });
      comp.ngOnInit();

      expect(auditoriaService.query).toHaveBeenCalled();
      expect(auditoriaService.addAuditoriaToCollectionIfMissing).toHaveBeenCalledWith(auditoriaCollection, auditoria);
      expect(comp.auditoriasCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const cuenta: ICuenta = { id: 456 };
      const auditoria: IAuditoria = { id: 9451 };
      cuenta.auditoria = auditoria;

      activatedRoute.data = of({ cuenta });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(cuenta));
      expect(comp.auditoriasCollection).toContain(auditoria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cuenta>>();
      const cuenta = { id: 123 };
      jest.spyOn(cuentaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cuenta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cuenta }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(cuentaService.update).toHaveBeenCalledWith(cuenta);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cuenta>>();
      const cuenta = new Cuenta();
      jest.spyOn(cuentaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cuenta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cuenta }));
      saveSubject.complete();

      // THEN
      expect(cuentaService.create).toHaveBeenCalledWith(cuenta);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cuenta>>();
      const cuenta = { id: 123 };
      jest.spyOn(cuentaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cuenta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cuentaService.update).toHaveBeenCalledWith(cuenta);
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
