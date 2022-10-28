import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAuditoria, Auditoria } from '../auditoria.model';

import { AuditoriaService } from './auditoria.service';

describe('Auditoria Service', () => {
  let service: AuditoriaService;
  let httpMock: HttpTestingController;
  let elemDefault: IAuditoria;
  let expectedResult: IAuditoria | IAuditoria[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AuditoriaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      usuarioCreacion: 0,
      fechaCreacion: currentDate,
      usuarioModificacion: 0,
      fechaModificacion: currentDate,
      request: 'AAAAAAA',
      response: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fechaCreacion: currentDate.format(DATE_TIME_FORMAT),
          fechaModificacion: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Auditoria', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fechaCreacion: currentDate.format(DATE_TIME_FORMAT),
          fechaModificacion: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaCreacion: currentDate,
          fechaModificacion: currentDate,
        },
        returnedFromService
      );

      service.create(new Auditoria()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Auditoria', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          usuarioCreacion: 1,
          fechaCreacion: currentDate.format(DATE_TIME_FORMAT),
          usuarioModificacion: 1,
          fechaModificacion: currentDate.format(DATE_TIME_FORMAT),
          request: 'BBBBBB',
          response: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaCreacion: currentDate,
          fechaModificacion: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Auditoria', () => {
      const patchObject = Object.assign(
        {
          usuarioCreacion: 1,
          fechaModificacion: currentDate.format(DATE_TIME_FORMAT),
        },
        new Auditoria()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fechaCreacion: currentDate,
          fechaModificacion: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Auditoria', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          usuarioCreacion: 1,
          fechaCreacion: currentDate.format(DATE_TIME_FORMAT),
          usuarioModificacion: 1,
          fechaModificacion: currentDate.format(DATE_TIME_FORMAT),
          request: 'BBBBBB',
          response: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaCreacion: currentDate,
          fechaModificacion: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Auditoria', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAuditoriaToCollectionIfMissing', () => {
      it('should add a Auditoria to an empty array', () => {
        const auditoria: IAuditoria = { id: 123 };
        expectedResult = service.addAuditoriaToCollectionIfMissing([], auditoria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(auditoria);
      });

      it('should not add a Auditoria to an array that contains it', () => {
        const auditoria: IAuditoria = { id: 123 };
        const auditoriaCollection: IAuditoria[] = [
          {
            ...auditoria,
          },
          { id: 456 },
        ];
        expectedResult = service.addAuditoriaToCollectionIfMissing(auditoriaCollection, auditoria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Auditoria to an array that doesn't contain it", () => {
        const auditoria: IAuditoria = { id: 123 };
        const auditoriaCollection: IAuditoria[] = [{ id: 456 }];
        expectedResult = service.addAuditoriaToCollectionIfMissing(auditoriaCollection, auditoria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(auditoria);
      });

      it('should add only unique Auditoria to an array', () => {
        const auditoriaArray: IAuditoria[] = [{ id: 123 }, { id: 456 }, { id: 28849 }];
        const auditoriaCollection: IAuditoria[] = [{ id: 123 }];
        expectedResult = service.addAuditoriaToCollectionIfMissing(auditoriaCollection, ...auditoriaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const auditoria: IAuditoria = { id: 123 };
        const auditoria2: IAuditoria = { id: 456 };
        expectedResult = service.addAuditoriaToCollectionIfMissing([], auditoria, auditoria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(auditoria);
        expect(expectedResult).toContain(auditoria2);
      });

      it('should accept null and undefined values', () => {
        const auditoria: IAuditoria = { id: 123 };
        expectedResult = service.addAuditoriaToCollectionIfMissing([], null, auditoria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(auditoria);
      });

      it('should return initial array if no Auditoria is added', () => {
        const auditoriaCollection: IAuditoria[] = [{ id: 123 }];
        expectedResult = service.addAuditoriaToCollectionIfMissing(auditoriaCollection, undefined, null);
        expect(expectedResult).toEqual(auditoriaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
