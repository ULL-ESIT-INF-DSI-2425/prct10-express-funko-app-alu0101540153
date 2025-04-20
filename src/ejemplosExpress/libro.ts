export class Libro {
  constructor(
      public id: number,
      public titulo: string,
      public autor: string,
      public genero: string,
      public año: number,
      public paginas: number
  ) {}
}

export type ResponseType = {
  success: boolean;
  message?: string;
  libro?: Libro;
  libros?: Libro[];
};