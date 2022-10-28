import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOperacion } from '../operacion.model';
import { OperacionService } from '../service/operacion.service';
import { OperacionDeleteDialogComponent } from '../delete/operacion-delete-dialog.component';

@Component({
  selector: 'jhi-operacion',
  templateUrl: './operacion.component.html',
})
export class OperacionComponent implements OnInit {
  operacions?: IOperacion[];
  isLoading = false;

  constructor(protected operacionService: OperacionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.operacionService.query().subscribe({
      next: (res: HttpResponse<IOperacion[]>) => {
        this.isLoading = false;
        this.operacions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IOperacion): number {
    return item.id!;
  }

  delete(operacion: IOperacion): void {
    const modalRef = this.modalService.open(OperacionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.operacion = operacion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
