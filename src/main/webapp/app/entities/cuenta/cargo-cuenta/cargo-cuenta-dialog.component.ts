import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICuenta } from '../cuenta.model';
import { CuentaService } from '../service/cuenta.service';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './cargo-cuenta-dialog.component.html',
})
export class CargarCuentaDialogComponent {
  account: Account | null = null;
  cuenta?: ICuenta;
  valor?: number = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(protected cuentaService: CuentaService, protected activeModal: NgbActiveModal,
    private accountService: AccountService) {
      this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cuentaService.cargarCuenta(id,this.valor!, this.account!.login).subscribe(() => {
      this.activeModal.close('cargada');
    });
  }

  
}
