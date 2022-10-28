import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ICuenta, Cuenta } from '../cuenta.model';
import { CuentaService } from '../service/cuenta.service';
import { IAuditoria } from 'app/entities/auditoria/auditoria.model';
import { AuditoriaService } from 'app/entities/auditoria/service/auditoria.service';
import { TipoCuenta } from 'app/entities/enumerations/tipo-cuenta.model';
import { takeUntil } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-cuenta-update',
  templateUrl: './cuenta-update.component.html',
})
export class CuentaUpdateComponent implements OnInit {

  account: Account | null = null;


  isSaving = false;
  tipoCuentaValues = Object.keys(TipoCuenta);

  auditoriasCollection: IAuditoria[] = [];

  editForm = this.fb.group({
    id: [],
    numeroCuenta: [],
    saldo: [],
    tipoCuenta: [],
    usuarioCreacion: [],
    fechaCreacion: [],
    usuarioModificacion: [],
    fechaModificacion: [],
  });

  private readonly destroy$ = new Subject<void>();
  
  constructor(
    protected cuentaService: CuentaService,
    protected auditoriaService: AuditoriaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService
    .getAuthenticationState()
    .pipe(takeUntil(this.destroy$))
    .subscribe(account => (this.account = account));

    this.activatedRoute.data.subscribe(({ cuenta }) => {
      this.updateForm(cuenta);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cuenta = this.createFromForm();
    if (cuenta.id !== undefined) {
      cuenta.usuarioModificacion = this.account?.login;
      this.subscribeToSaveResponse(this.cuentaService.update(cuenta));
    } else {
      cuenta.usuarioCreacion = this.account?.login;
      this.subscribeToSaveResponse(this.cuentaService.create(cuenta));
    }
  }

  trackAuditoriaById(_index: number, item: IAuditoria): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICuenta>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(cuenta: ICuenta): void {
    this.editForm.patchValue({
      id: cuenta.id,
      numeroCuenta: cuenta.numeroCuenta,
      saldo: cuenta.saldo,
      tipoCuenta: cuenta.tipoCuenta,
      usuarioCreacion: cuenta.usuarioCreacion,
      fechaCreacion: cuenta.fechaCreacion ? cuenta.fechaCreacion.format(DATE_TIME_FORMAT) : null,
      usuarioModificacion: cuenta.usuarioModificacion,
      fechaModificacion: cuenta.fechaModificacion ? cuenta.fechaModificacion.format(DATE_TIME_FORMAT) : null
    });
  }

  protected loadRelationshipsOptions(): void {
    this.auditoriaService
      .query({ filter: 'cuenta-is-null' })
      .pipe(map((res: HttpResponse<IAuditoria[]>) => res.body ?? []))
      .pipe(
        map((auditorias: IAuditoria[]) =>
          this.auditoriaService.addAuditoriaToCollectionIfMissing(auditorias, this.editForm.get('auditoria')!.value)
        )
      )
      .subscribe((auditorias: IAuditoria[]) => (this.auditoriasCollection = auditorias));
  }

  protected createFromForm(): ICuenta {
    return {
      ...new Cuenta(),
      id: this.editForm.get(['id'])!.value,
      numeroCuenta: this.editForm.get(['numeroCuenta'])!.value,
      saldo: this.editForm.get(['saldo'])!.value,
      tipoCuenta: this.editForm.get(['tipoCuenta'])!.value,
      usuarioCreacion: this.editForm.get(['usuarioCreacion'])!.value,
      fechaCreacion: this.editForm.get(['fechaCreacion'])!.value
        ? dayjs(this.editForm.get(['fechaCreacion'])!.value, DATE_TIME_FORMAT)
        : undefined,
      usuarioModificacion: this.editForm.get(['usuarioModificacion'])!.value,
      fechaModificacion: this.editForm.get(['fechaModificacion'])!.value
        ? dayjs(this.editForm.get(['fechaModificacion'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
