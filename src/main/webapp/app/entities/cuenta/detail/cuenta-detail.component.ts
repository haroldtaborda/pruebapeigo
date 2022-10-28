import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICuenta } from '../cuenta.model';

@Component({
  selector: 'jhi-cuenta-detail',
  templateUrl: './cuenta-detail.component.html',
})
export class CuentaDetailComponent implements OnInit {
  cuenta: ICuenta | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cuenta }) => {
      this.cuenta = cuenta;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
