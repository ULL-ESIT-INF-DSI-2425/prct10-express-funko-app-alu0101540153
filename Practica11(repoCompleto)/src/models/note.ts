import { Document, Schema, model } from 'mongoose';

interface FunkoDocumentInterface extends Document {
  nombre: string;
  descripcion: string;
  tipo: 'Pop' | 'Otro';
  genero: 'Animación' | 'Videojuegos' | 'Otro';
  franquicia: string;
  numero: number;
  exclusivo: boolean;
  caracteristicasEspeciales: string;
  valorDeMercado: number;
}

const FunkoSchema = new Schema<FunkoDocumentInterface>({
  nombre: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('funco title must start with a capital letter');
      }
    },
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Pop', 'Otro'],
  },
  genero: {
    type: String,
    required: true,
    enum: ['Animación', 'Videojuegos', 'Otro'],
  },
  franquicia: {
    type: String,
    required: true,
    trim: true,
  },
  numero: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('tiene q ser positiv');
      }
    },
  },
  exclusivo: {
    type: Boolean,
    required: true,
    default: false,
  },
  caracteristicasEspeciales: {
    type: String,
    required: false,
    trim: true,
    default: 'Ninguna',
  },
  valorDeMercado: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('tiene q ser positiv');
      }
    },
  },
});

export const Funko = model<FunkoDocumentInterface>('Funko', FunkoSchema);