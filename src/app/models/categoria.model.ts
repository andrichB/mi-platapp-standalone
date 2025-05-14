export interface Categoria {
  id?: string;
  usuarioId: string;         // UID del usuario
  nombre: string;            // Nombre de la categoría (ej: "Salario", "Transporte")
  tipo: 'Ingreso' | 'Egreso';
  color?: string;            // Color en formato hex o nombre (ej: "#FF9900" o "blue")
  emoji?: string;            // Emoji o ícono como string (ej: "💼", "🍕")
}