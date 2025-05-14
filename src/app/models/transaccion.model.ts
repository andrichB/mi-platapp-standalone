export interface Transaccion {
  id?: string;
  usuarioId: string;
  cuentaId: string;
  categoriaId?: string;
  tipo: 'Ingreso' | 'Egreso' | 'Transferencia';
  monto: number;
  fecha: string;
  descripcion?: string;
  cuentaDestinoId?: string;
}
