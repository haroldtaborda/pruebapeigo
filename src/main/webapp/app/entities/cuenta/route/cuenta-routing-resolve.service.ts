import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICuenta, Cuenta } from '../cuenta.model';
import { CuentaService } from '../service/cuenta.service';

@Injectable({ providedIn: 'root' })
export class CuentaRoutingResolveService implements Resolve<ICuenta> {
  constructor(protected service: CuentaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICuenta> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cuenta: HttpResponse<Cuenta>) => {
          if (cuenta.body) {
            return of(cuenta.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cuenta());
  }
}
