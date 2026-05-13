export interface EnvironmentVariables {
  PORT?: number;
  NODE_ENV?: 'development' | 'production' | 'test';
}

export const environment = (): EnvironmentVariables => ({
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV: (process.env.NODE_ENV as EnvironmentVariables['NODE_ENV']) ?? 'development',
});