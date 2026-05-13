export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
}

export const swaggerConfig: SwaggerConfig = {
  title: 'SGO Back API',
  description: 'API base organizada por modulos en NestJS',
  version: '1.0.0',
};