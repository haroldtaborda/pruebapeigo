import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOperacion } from '../operacion.model';

@Component({
  selector: 'jhi-operacion-detail',
  templateUrl: './operacion-detail.component.html',
})
export class OperacionDetailComponent implements OnInit {
  operacion: IOperacion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operacion }) => {
      this.operacion = operacion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
