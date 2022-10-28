import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuditoria, getAuditoriaIdentifier } from '../auditoria.model';

export type EntityResponseType = HttpResponse<IAuditoria>;
export type EntityArrayResponseType = HttpResponse<IAuditoria[]>;

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/auditorias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(auditoria: IAuditoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auditoria);
    return this.http
      .post<IAuditoria>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(auditoria: IAuditoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auditoria);
    return this.http
      .put<IAuditoria>(`${this.resourceUrl}/${getAuditoriaIdentifier(auditoria) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(auditoria: IAuditoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auditoria);
    return this.http
      .patch<IAuditoria>(`${this.resourceUrl}/${getAuditoriaIdentifier(auditoria) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAuditoria>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAuditoria[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAuditoriaToCollectionIfMissing(
    auditoriaCollection: IAuditoria[],
    ...auditoriasToCheck: (IAuditoria | null | undefined)[]
  ): IAuditoria[] {
    const auditorias: IAuditoria[] = auditoriasToCheck.filter(isPresent);
    if (auditorias.length > 0) {
      const auditoriaCollectionIdentifiers = auditoriaCollection.map(auditoriaItem => getAuditoriaIdentifier(auditoriaItem)!);
      const auditoriasToAdd = auditorias.filter(auditoriaItem => {
        const auditoriaIdentifier = getAuditoriaIdentifier(auditoriaItem);
        if (auditoriaIdentifier == null || auditoriaCollectionIdentifiers.includes(auditoriaIdentifier)) {
          return false;
        }
        auditoriaCollectionIdentifiers.push(auditoriaIdentifier);
        return true;
      });
      return [...auditoriasToAdd, ...auditoriaCollection];
    }
    return auditoriaCollection;
  }

  protected convertDateFromClient(auditoria: IAuditoria): IAuditoria {
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
      res.body.forEach((auditoria: IAuditoria) => {
        auditoria.fechaCreacion = auditoria.fechaCreacion ? dayjs(auditoria.fechaCreacion) : undefined;
        auditoria.fechaModificacion = auditoria.fechaModificacion ? dayjs(auditoria.fechaModificacion) : undefined;
      });
    }
    return res;
  }
}
