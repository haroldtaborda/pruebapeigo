import dayjs from 'dayjs/esm';

export interface IAuditoria {
  id?: number;
  usuarioCreacion?: number | null;
  fechaCreacion?: dayjs.Dayjs | null;
  usuarioModificacion?: number | null;
  fechaModificacion?: dayjs.Dayjs | null;
  request?: string | null;
  response?: string | null;
}

export class Auditoria implements IAuditoria {
  constructor(
    public id?: number,
    public usuarioCreacion?: number | null,
    public fechaCreacion?: dayjs.Dayjs | null,
    public usuarioModificacion?: number | null,
    public fechaModificacion?: dayjs.Dayjs | null,
    public request?: string | null,
    public response?: string | null
  ) {}
}

export function getAuditoriaIdentifier(auditoria: IAuditoria): number | undefined {
  return auditoria.id;
}
