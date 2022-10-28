import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuditoria } from '../auditoria.model';
import { AuditoriaService } from '../service/auditoria.service';

@Component({
  templateUrl: './auditoria-delete-dialog.component.html',
})
export class AuditoriaDeleteDialogComponent {
  auditoria?: IAuditoria;

  constructor(protected auditoriaService: AuditoriaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.auditoriaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
