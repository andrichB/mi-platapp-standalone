export interface Categoria {
  id?: string;
  usuarioId: string;
  nombre: string;
  tipo: 'Ingreso' | 'Egreso';
  color?: string;
}
