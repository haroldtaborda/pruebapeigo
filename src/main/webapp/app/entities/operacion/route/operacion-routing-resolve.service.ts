import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOperacion, Operacion } from '../operacion.model';
import { OperacionService } from '../service/operacion.service';

@Injectable({ providedIn: 'root' })
export class OperacionRoutingResolveService implements Resolve<IOperacion> {
  constructor(protected service: OperacionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOperacion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((operacion: HttpResponse<Operacion>) => {
          if (operacion.body) {
            return of(operacion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Operacion());
  }
}
