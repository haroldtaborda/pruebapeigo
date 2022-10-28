import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICuenta } from '../cuenta.model';
import { CuentaService } from '../service/cuenta.service';
import { CuentaDeleteDialogComponent } from '../delete/cuenta-delete-dialog.component';
import { CargarCuentaDialogComponent } from '../cargo-cuenta/cargo-cuenta-dialog.component';
import { MermarCuentaDialogComponent } from '../mermo-cuenta/mermo-cuenta-dialog.component';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'jhi-cuenta',
  templateUrl: './cuenta.component.html',
})
export class CuentaComponent implements OnInit {
  cuentas?: ICuenta[];
  isLoading = false;
  numCuenta = "";
  account: Account | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(protected cuentaService: CuentaService, protected modalService: NgbModal,
    private accountService: AccountService) {}

  loadAll(): void {
    this.isLoading = true;

    this.cuentaService.query().subscribe({
      next: (res: HttpResponse<ICuenta[]>) => {
        this.isLoading = false;
        this.cuentas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadFiltros(): void {
    this.isLoading = true;

    this.cuentaService.queryNumero(this.numCuenta, this.account!.login).subscribe({
      next: (res: HttpResponse<ICuenta[]>) => {
        this.isLoading = false;
        this.cuentas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
      this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.loadFiltros();
  }

  trackId(_index: number, item: ICuenta): number {
    return item.id!;
  }

  delete(cuenta: ICuenta): void {
    const modalRef = this.modalService.open(CuentaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cuenta = cuenta;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  cargar(cuenta: ICuenta): void {
    const modalRef = this.modalService.open(CargarCuentaDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cuenta = cuenta;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'cargada') {
        this.loadAll();
      }
    });
  }

  mermar(cuenta: ICuenta): void {
    const modalRef = this.modalService.open(MermarCuentaDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cuenta = cuenta;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'mermada') {
        this.loadAll();
      }
    });
  }
}
