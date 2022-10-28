import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cuenta',
        data: { pageTitle: 'pruebapeigoApp.cuenta.home.title' },
        loadChildren: () => import('./cuenta/cuenta.module').then(m => m.CuentaModule),
      },
      {
        path: 'auditoria',
        data: { pageTitle: 'pruebapeigoApp.auditoria.home.title' },
        loadChildren: () => import('./auditoria/auditoria.module').then(m => m.AuditoriaModule),
      },
      {
        path: 'operacion',
        data: { pageTitle: 'pruebapeigoApp.operacion.home.title' },
        loadChildren: () => import('./operacion/operacion.module').then(m => m.OperacionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
