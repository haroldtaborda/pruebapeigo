import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OperacionService } from '../service/operacion.service';

import { OperacionComponent } from './operacion.component';

describe('Operacion Management Component', () => {
  let comp: OperacionComponent;
  let fixture: ComponentFixture<OperacionComponent>;
  let service: OperacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OperacionComponent],
    })
      .overrideTemplate(OperacionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OperacionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OperacionService);

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
    expect(comp.operacions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
