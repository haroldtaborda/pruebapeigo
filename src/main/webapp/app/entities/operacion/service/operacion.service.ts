import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOperacion, getOperacionIdentifier } from '../operacion.model';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

export type EntityResponseType = HttpResponse<IOperacion>;
export type EntityArrayResponseType = HttpResponse<IOperacion[]>;

@Injectable({ providedIn: 'root' })
export class OperacionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/operacions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(operacion: IOperacion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operacion);
    return this.http
      .post<IOperacion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(operacion: IOperacion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operacion);
    return this.http
      .put<IOperacion>(`${this.resourceUrl}/${getOperacionIdentifier(operacion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(operacion: IOperacion): Observable<EntityResponseType> {
    return this.http.patch<IOperacion>(`${this.resourceUrl}/${getOperacionIdentifier(operacion) as number}`, operacion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
    .get<IOperacion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
    .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOperacion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOperacionToCollectionIfMissing(
    operacionCollection: IOperacion[],
    ...operacionsToCheck: (IOperacion | null | undefined)[]
  ): IOperacion[] {
    const operacions: IOperacion[] = operacionsToCheck.filter(isPresent);
    if (operacions.length > 0) {
      const operacionCollectionIdentifiers = operacionCollection.map(operacionItem => getOperacionIdentifier(operacionItem)!);
      const operacionsToAdd = operacions.filter(operacionItem => {
        const operacionIdentifier = getOperacionIdentifier(operacionItem);
        if (operacionIdentifier == null || operacionCollectionIdentifiers.includes(operacionIdentifier)) {
          return false;
        }
        operacionCollectionIdentifiers.push(operacionIdentifier);
        return true;
      });
      return [...operacionsToAdd, ...operacionCollection];
    }
    return operacionCollection;
  }

  protected convertDateFromClient(auditoria: IOperacion): IOperacion {
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
      res.body.forEach((auditoria: IOperacion) => {
        auditoria.fechaCreacion = auditoria.fechaCreacion ? dayjs(auditoria.fechaCreacion) : undefined;
        auditoria.fechaModificacion = auditoria.fechaModificacion ? dayjs(auditoria.fechaModificacion) : undefined;
      });
    }
    return res;
  }
}
