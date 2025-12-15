// types/riderProfile.ts
export interface RiderProfile {
  id: string;              // user:xxx
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  rating?: number;         // avaliação média do passageiro
  ridesCompleted?: number; // total de corridas concluídas
}
