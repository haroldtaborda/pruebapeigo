import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOperacion, Operacion } from '../operacion.model';

import { OperacionService } from './operacion.service';

describe('Operacion Service', () => {
  let service: OperacionService;
  let httpMock: HttpTestingController;
  let elemDefault: IOperacion;
  let expectedResult: IOperacion | IOperacion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OperacionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      numeroOperacion: 'AAAAAAA',
      monto: 0,
      cuentaOrigen: 0,
      cuentaDestino: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Operacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Operacion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Operacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroOperacion: 'BBBBBB',
          monto: 1,
          cuentaOrigen: 1,
          cuentaDestino: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Operacion', () => {
      const patchObject = Object.assign({}, new Operacion());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Operacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroOperacion: 'BBBBBB',
          monto: 1,
          cuentaOrigen: 1,
          cuentaDestino: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Operacion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOperacionToCollectionIfMissing', () => {
      it('should add a Operacion to an empty array', () => {
        const operacion: IOperacion = { id: 123 };
        expectedResult = service.addOperacionToCollectionIfMissing([], operacion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operacion);
      });

      it('should not add a Operacion to an array that contains it', () => {
        const operacion: IOperacion = { id: 123 };
        const operacionCollection: IOperacion[] = [
          {
            ...operacion,
          },
          { id: 456 },
        ];
        expectedResult = service.addOperacionToCollectionIfMissing(operacionCollection, operacion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Operacion to an array that doesn't contain it", () => {
        const operacion: IOperacion = { id: 123 };
        const operacionCollection: IOperacion[] = [{ id: 456 }];
        expectedResult = service.addOperacionToCollectionIfMissing(operacionCollection, operacion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operacion);
      });

      it('should add only unique Operacion to an array', () => {
        const operacionArray: IOperacion[] = [{ id: 123 }, { id: 456 }, { id: 69722 }];
        const operacionCollection: IOperacion[] = [{ id: 123 }];
        expectedResult = service.addOperacionToCollectionIfMissing(operacionCollection, ...operacionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const operacion: IOperacion = { id: 123 };
        const operacion2: IOperacion = { id: 456 };
        expectedResult = service.addOperacionToCollectionIfMissing([], operacion, operacion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operacion);
        expect(expectedResult).toContain(operacion2);
      });

      it('should accept null and undefined values', () => {
        const operacion: IOperacion = { id: 123 };
        expectedResult = service.addOperacionToCollectionIfMissing([], null, operacion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operacion);
      });

      it('should return initial array if no Operacion is added', () => {
        const operacionCollection: IOperacion[] = [{ id: 123 }];
        expectedResult = service.addOperacionToCollectionIfMissing(operacionCollection, undefined, null);
        expect(expectedResult).toEqual(operacionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
