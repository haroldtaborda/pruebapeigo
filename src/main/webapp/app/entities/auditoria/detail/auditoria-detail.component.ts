import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuditoria } from '../auditoria.model';

@Component({
  selector: 'jhi-auditoria-detail',
  templateUrl: './auditoria-detail.component.html',
})
export class AuditoriaDetailComponent implements OnInit {
  auditoria: IAuditoria | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ auditoria }) => {
      this.auditoria = auditoria;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
