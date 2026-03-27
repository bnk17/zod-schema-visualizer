export type GenerationStatus =
  | { phase: 'idle' }
  | { phase: 'streaming'; partial: string }
  | { phase: 'done'; schema: string }
  | { phase: 'error'; message: string };

export interface GenerateSchemaRequest {
  prompt: string;
}
