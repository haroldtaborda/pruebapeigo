import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TipoCuenta } from 'app/entities/enumerations/tipo-cuenta.model';
import { ICuenta, Cuenta } from '../cuenta.model';

import { CuentaService } from './cuenta.service';

describe('Cuenta Service', () => {
  let service: CuentaService;
  let httpMock: HttpTestingController;
  let elemDefault: ICuenta;
  let expectedResult: ICuenta | ICuenta[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CuentaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      numeroCuenta: 'AAAAAAA',
      saldo: 0,
      tipoCuenta: TipoCuenta.AHORROS,
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

    it('should create a Cuenta', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Cuenta()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cuenta', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroCuenta: 'BBBBBB',
          saldo: 1,
          tipoCuenta: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cuenta', () => {
      const patchObject = Object.assign(
        {
          saldo: 1,
          tipoCuenta: 'BBBBBB',
        },
        new Cuenta()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cuenta', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroCuenta: 'BBBBBB',
          saldo: 1,
          tipoCuenta: 'BBBBBB',
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

    it('should delete a Cuenta', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCuentaToCollectionIfMissing', () => {
      it('should add a Cuenta to an empty array', () => {
        const cuenta: ICuenta = { id: 123 };
        expectedResult = service.addCuentaToCollectionIfMissing([], cuenta);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cuenta);
      });

      it('should not add a Cuenta to an array that contains it', () => {
        const cuenta: ICuenta = { id: 123 };
        const cuentaCollection: ICuenta[] = [
          {
            ...cuenta,
          },
          { id: 456 },
        ];
        expectedResult = service.addCuentaToCollectionIfMissing(cuentaCollection, cuenta);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cuenta to an array that doesn't contain it", () => {
        const cuenta: ICuenta = { id: 123 };
        const cuentaCollection: ICuenta[] = [{ id: 456 }];
        expectedResult = service.addCuentaToCollectionIfMissing(cuentaCollection, cuenta);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cuenta);
      });

      it('should add only unique Cuenta to an array', () => {
        const cuentaArray: ICuenta[] = [{ id: 123 }, { id: 456 }, { id: 29463 }];
        const cuentaCollection: ICuenta[] = [{ id: 123 }];
        expectedResult = service.addCuentaToCollectionIfMissing(cuentaCollection, ...cuentaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cuenta: ICuenta = { id: 123 };
        const cuenta2: ICuenta = { id: 456 };
        expectedResult = service.addCuentaToCollectionIfMissing([], cuenta, cuenta2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cuenta);
        expect(expectedResult).toContain(cuenta2);
      });

      it('should accept null and undefined values', () => {
        const cuenta: ICuenta = { id: 123 };
        expectedResult = service.addCuentaToCollectionIfMissing([], null, cuenta, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cuenta);
      });

      it('should return initial array if no Cuenta is added', () => {
        const cuentaCollection: ICuenta[] = [{ id: 123 }];
        expectedResult = service.addCuentaToCollectionIfMissing(cuentaCollection, undefined, null);
        expect(expectedResult).toEqual(cuentaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
