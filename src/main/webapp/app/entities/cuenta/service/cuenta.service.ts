import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICuenta, getCuentaIdentifier, Cuenta } from '../cuenta.model';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

export type EntityResponseType = HttpResponse<ICuenta>;
export type EntityArrayResponseType = HttpResponse<ICuenta[]>;

@Injectable({ providedIn: 'root' })
export class CuentaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cuentas');
  protected resourceCargarCuentaUrl = this.applicationConfigService.getEndpointFor('api/cargarCuenta');
  protected resourceMermarCuentaUrl = this.applicationConfigService.getEndpointFor('api/mermarCuenta');

  protected resourceconsultarCuentasNumeroUrl = this.applicationConfigService.getEndpointFor('api/consultarCuentasNumero');


  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cuenta: ICuenta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cuenta);
    return this.http
      .post<ICuenta>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(cuenta: ICuenta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cuenta);
    return this.http
      .put<ICuenta>(`${this.resourceUrl}/${getCuentaIdentifier(cuenta) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(cuenta: ICuenta): Observable<EntityResponseType> {
    return this.http.patch<ICuenta>(`${this.resourceUrl}/${getCuentaIdentifier(cuenta) as number}`, cuenta, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
    .get<ICuenta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
    .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICuenta[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryNumero(numero: string, usuario: string): Observable<EntityArrayResponseType> {
    if(!numero){
      numero = "TODAS";
    }
    return this.http
      .get<ICuenta[]>(`${this.resourceconsultarCuentasNumeroUrl}/${numero}/${usuario}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  cargarCuenta(id: number, valor: number, login: string): Observable<HttpResponse<{}>> {
    const cuenta = new Cuenta();
    cuenta.id = id;
    cuenta.saldo = valor;
    cuenta.usuarioModificacion = login;
    return this.http.post<ICuenta>(this.resourceCargarCuentaUrl, cuenta, { observe: 'response' });
  }

  mermarCuenta(id: number, valor: number, login: string): Observable<HttpResponse<{}>> {
    const cuenta = new Cuenta();
    cuenta.id = id;
    cuenta.saldo = valor;
    cuenta.usuarioModificacion = login;
    return this.http.post<ICuenta>(this.resourceMermarCuentaUrl, cuenta, { observe: 'response' });
  }

  addCuentaToCollectionIfMissing(cuentaCollection: ICuenta[], ...cuentasToCheck: (ICuenta | null | undefined)[]): ICuenta[] {
    const cuentas: ICuenta[] = cuentasToCheck.filter(isPresent);
    if (cuentas.length > 0) {
      const cuentaCollectionIdentifiers = cuentaCollection.map(cuentaItem => getCuentaIdentifier(cuentaItem)!);
      const cuentasToAdd = cuentas.filter(cuentaItem => {
        const cuentaIdentifier = getCuentaIdentifier(cuentaItem);
        if (cuentaIdentifier == null || cuentaCollectionIdentifiers.includes(cuentaIdentifier)) {
          return false;
        }
        cuentaCollectionIdentifiers.push(cuentaIdentifier);
        return true;
      });
      return [...cuentasToAdd, ...cuentaCollection];
    }
    return cuentaCollection;
  }

  protected convertDateFromClient(auditoria: ICuenta): ICuenta {
    return Object.assign({}, auditoria, {
      fechaCreacion: auditoria.fechaCreacion?.isValid() ? auditoria.fechaCreacion.toJSON() : undefined,
      fechaModificacion: auditoria.fechaModificacion?.isValid() ? auditoria.fechaModificacion.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaCreacion = res.body.fechaCreacion ? dayjs(res.body.fechaCreacion) : undefined;
      res.body.fechaModificacion = res.body.fechaModificacion ? dayjs(res.body.fechaModificacion) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((auditoria: ICuenta) => {
        auditoria.fechaCreacion = auditoria.fechaCreacion ? dayjs(auditoria.fechaCreacion) : undefined;
        auditoria.fechaModificacion = auditoria.fechaModificacion ? dayjs(auditoria.fechaModificacion) : undefined;
      });
    }
    return res;
  }
}
