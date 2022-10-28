import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CuentaService } from '../service/cuenta.service';

import { CuentaComponent } from './cuenta.component';

describe('Cuenta Management Component', () => {
  let comp: CuentaComponent;
  let fixture: ComponentFixture<CuentaComponent>;
  let service: CuentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CuentaComponent],
    })
      .overrideTemplate(CuentaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CuentaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CuentaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.cuentas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
