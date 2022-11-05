import { isDevMode } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { IRequest, IResponse, RequestError } from "./request";

/**
 * Classe base dos serviços que realizam requisições para a API.
 */
export abstract class RequestService {
  /**
   * Envia uma requisição para a API.
   * @param params Parâmetros da requisição.
   * @returns Resposta da requisição.
   */
  protected async request<TResult = any>({
    method,
    route,
    body,
  }: IRequest): Promise<IResponse<TResult>> {
    // Montar url da requisição.
    const url = isDevMode() ? `http://localhost:5000/api${route}` : `/api${route}`;

    // Obter o token da sessão.
    const token = localStorage.getItem("token");

    // Enviar requisição para a API.
    const response = await fetch(url, {
      cache: "no-cache",
      method: method ?? "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",

        ...(token && {
          "Authorization": `Bearer ${token}`
        }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Verificar se a requisição foi enviada com sucesso.
    if (response.ok) {
      // Retornar resposta da requisição (JSON).
      const data = await response.json();
      return data as IResponse<TResult>;
    }

    try {
      // Tentar obter o corpo da resposta.
      const data = await response.json();

      // Erro no servidor.
      throw new RequestError(response, data);
    } catch (e) {}

    // Erro ao enviar requisição.
    throw new RequestError(response);
  }

  /**
   * Exibe uma mensagem de erro.
   * @param error Erro.
   * @param toastrService Serviço de notificações.
   */
  public handleRequestError(error: Error, toastrService: ToastrService) {
    // Verificar se é uma instância de @RequestError.
    if (error instanceof RequestError) {
      switch (error.statusCode) {
        case 500: // 500 Internal Server Error
          toastrService.error("Erro interno no servidor!", "Erro");
          return;
        case 401: // 401 Unauthorized
          // Remover token.
          localStorage.removeItem("token");

          // Exibir mensagem de erro.
          toastrService.error("Você ainda não iniciou sua jornada!", "Erro");
          return;
      }
    }

    // Falha na comunicação com o servidor.
    toastrService.error("Falha na comunicação com o servidor!", "Erro");
  }
}
