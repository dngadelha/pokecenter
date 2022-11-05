/**
 * Interface de requisição para a API.
 */
export interface IRequest {
  /**
   * Método da requisição.
   */
  method: "GET" | "POST" | "PUT" | "DELETE";

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
