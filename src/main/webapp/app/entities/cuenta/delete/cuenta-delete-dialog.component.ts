import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICuenta } from '../cuenta.model';
import { CuentaService } from '../service/cuenta.service';

@Component({
  templateUrl: './cuenta-delete-dialog.component.html',
})
export class CuentaDeleteDialogComponent {
  cuenta?: ICuenta;

  constructor(protected cuentaService: CuentaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cuentaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
