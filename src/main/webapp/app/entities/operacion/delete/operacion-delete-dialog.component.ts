import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOperacion } from '../operacion.model';
import { OperacionService } from '../service/operacion.service';

@Component({
  templateUrl: './operacion-delete-dialog.component.html',
})
export class OperacionDeleteDialogComponent {
  operacion?: IOperacion;

  constructor(protected operacionService: OperacionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.operacionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
