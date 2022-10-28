import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuditoriaService } from '../service/auditoria.service';

import { AuditoriaComponent } from './auditoria.component';

describe('Auditoria Management Component', () => {
  let comp: AuditoriaComponent;
  let fixture: ComponentFixture<AuditoriaComponent>;
  let service: AuditoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AuditoriaComponent],
    })
      .overrideTemplate(AuditoriaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuditoriaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AuditoriaService);

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
    expect(comp.auditorias?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
