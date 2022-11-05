import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, isDevMode } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { catchError } from "rxjs";
import { IRequest, IResponse } from "./request";

/**
 * Classe base dos serviços que realizam requisições para a API.
 */
@Injectable({
  providedIn: "root"
})
export abstract class RequestService {
  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {}

  /**
   * Envia uma requisição para a API.
   * @param params Parâmetros da requisição.
   * @returns Resposta da requisição.
   */
  protected request<TResult = any>({
    method,
    route,
    body,
  }: IRequest) {
    // Montar url da requisição.
    const url = isDevMode() ? `http://localhost:5000/api${route}` : `/api${route}`;

    // Obter o token da sessão.
    const token = localStorage.getItem("token");

    // Enviar requisição para a API.
    return this.httpClient.request<
      IResponse<TResult>
    >(
      /* Método: */ method,
      /* URL: */ url,
      /* Parâmetros: */ {
        body,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",

          ...(token && {
            "Authorization": `Bearer ${token}`
          }),
        },
      }
    ).pipe(
      catchError(
        async (error) => this.handleRequestError(error)
      )
    );
  }

  /**
   * Exibe uma mensagem de erro.
   * @param error Erro.
   */
  protected handleRequestError(error: Error) {
    // Verificar se é uma instância de @HttpErrorResponse.
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 500: // 500 Internal Server Error
          this.toastrService.error("Erro interno no servidor!", "Erro");
          return;
        case 401: // 401 Unauthorized
          // Remover token.
          localStorage.removeItem("token");

          // Exibir mensagem de erro.
          this.toastrService.error("Você ainda não iniciou sua jornada!", "Erro");
          return;
      }
    }

    // Falha na comunicação com o servidor.
    this.toastrService.error("Falha na comunicação com o servidor!", "Erro");
  }
}
