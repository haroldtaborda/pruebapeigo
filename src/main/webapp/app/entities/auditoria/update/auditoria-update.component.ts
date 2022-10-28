import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAuditoria, Auditoria } from '../auditoria.model';
import { AuditoriaService } from '../service/auditoria.service';

@Component({
  selector: 'jhi-auditoria-update',
  templateUrl: './auditoria-update.component.html',
})
export class AuditoriaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    usuarioCreacion: [],
    fechaCreacion: [],
    usuarioModificacion: [],
    fechaModificacion: [],
    request: [],
    response: [],
  });

  constructor(protected auditoriaService: AuditoriaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ auditoria }) => {
      if (auditoria.id === undefined) {
        const today = dayjs().startOf('day');
        auditoria.fechaCreacion = today;
        auditoria.fechaModificacion = today;
      }

      this.updateForm(auditoria);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const auditoria = this.createFromForm();
    if (auditoria.id !== undefined) {
      this.subscribeToSaveResponse(this.auditoriaService.update(auditoria));
    } else {
      this.subscribeToSaveResponse(this.auditoriaService.create(auditoria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuditoria>>): void {
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

  protected updateForm(auditoria: IAuditoria): void {
    this.editForm.patchValue({
      id: auditoria.id,
      usuarioCreacion: auditoria.usuarioCreacion,
      fechaCreacion: auditoria.fechaCreacion ? auditoria.fechaCreacion.format(DATE_TIME_FORMAT) : null,
      usuarioModificacion: auditoria.usuarioModificacion,
      fechaModificacion: auditoria.fechaModificacion ? auditoria.fechaModificacion.format(DATE_TIME_FORMAT) : null,
      request: auditoria.request,
      response: auditoria.response,
    });
  }

  protected createFromForm(): IAuditoria {
    return {
      ...new Auditoria(),
      id: this.editForm.get(['id'])!.value,
      usuarioCreacion: this.editForm.get(['usuarioCreacion'])!.value,
      fechaCreacion: this.editForm.get(['fechaCreacion'])!.value
        ? dayjs(this.editForm.get(['fechaCreacion'])!.value, DATE_TIME_FORMAT)
        : undefined,
      usuarioModificacion: this.editForm.get(['usuarioModificacion'])!.value,
      fechaModificacion: this.editForm.get(['fechaModificacion'])!.value
        ? dayjs(this.editForm.get(['fechaModificacion'])!.value, DATE_TIME_FORMAT)
        : undefined,
      request: this.editForm.get(['request'])!.value,
      response: this.editForm.get(['response'])!.value,
    };
  }
}
