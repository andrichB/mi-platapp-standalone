export interface Cuenta {
  id?: string;
  usuarioId: string;
  nombre: string;
  tipo: 'Efectivo' | 'Banco' | 'Otro';
  saldoInicial: number;
  moneda: string;
}
