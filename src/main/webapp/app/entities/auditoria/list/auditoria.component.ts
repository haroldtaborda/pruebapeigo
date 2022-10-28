import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuditoria } from '../auditoria.model';
import { AuditoriaService } from '../service/auditoria.service';
import { AuditoriaDeleteDialogComponent } from '../delete/auditoria-delete-dialog.component';

@Component({
  selector: 'jhi-auditoria',
  templateUrl: './auditoria.component.html',
})
export class AuditoriaComponent implements OnInit {
  auditorias?: IAuditoria[];
  isLoading = false;

  constructor(protected auditoriaService: AuditoriaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.auditoriaService.query().subscribe({
      next: (res: HttpResponse<IAuditoria[]>) => {
        this.isLoading = false;
        this.auditorias = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAuditoria): number {
    return item.id!;
  }

  delete(auditoria: IAuditoria): void {
    const modalRef = this.modalService.open(AuditoriaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.auditoria = auditoria;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
