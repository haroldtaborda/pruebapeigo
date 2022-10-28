import { TipoCuenta } from 'app/entities/enumerations/tipo-cuenta.model';
import dayjs from 'dayjs/esm';

export interface ICuenta {
  id?: number;
  numeroCuenta?: string | null;
  saldo?: number | null;
  tipoCuenta?: TipoCuenta | null;
  usuarioCreacion?: string | null;
  fechaCreacion?: dayjs.Dayjs | null;
  usuarioModificacion?: string | null;
  fechaModificacion?: dayjs.Dayjs | null;
}

export class Cuenta implements ICuenta {
  constructor(
    public id?: number,
    public numeroCuenta?: string | null,
    public saldo?: number | null,
    public tipoCuenta?: TipoCuenta | null,
    public usuarioCreacion?: string | null,
    public fechaCreacion?: dayjs.Dayjs | null,
    public usuarioModificacion?: string | null,
    public fechaModificacion?: dayjs.Dayjs | null,
  ) {}
}

export function getCuentaIdentifier(cuenta: ICuenta): number | undefined {
  return cuenta.id;
}
