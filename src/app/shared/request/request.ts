/**
 * Interface de requisição para a API.
 */
export interface IRequest {
  /**
   * Método da requisição.
   */
  method?: "GET" | "POST" | "PUT" | "DELETE";

  /**
   * Rota da API.
   */
  route: string;

  /**
   * Parâmetros da requisição.
   */
  body?: object;
}

/**
 * Interface de resposta da API.
 */
export interface IResponse<TResult = any> {
  /**
   * Status da resposta do servidor.
   */
  status: string;

  /**
   * Resultado da requisição.
   */
  result: TResult | null;
}

/**
 * Erro de requisição.
 */
export class RequestError extends Error {
  /**
   * Código do erro.
   */
  public readonly statusCode: number;

  constructor(response: Response, data?: any) {
    super(`Erro ${response.status} (${response.statusText}) ao realizar a requisição para a rota "${response.url}".`);
    this.statusCode = response.status;
  }
}
