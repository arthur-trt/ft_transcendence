import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { QueryFailedError } from "typeorm";
import { Socket } from "socket.io";
import { RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';


@Catch(WsException, HttpException, QueryFailedError)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException | QueryFailedError , host: ArgumentsHost) {

  const client = host.switchToWs().getClient() as Socket;
	  const data = host.switchToWs().getData();
	let error;
	if (exception instanceof WsException)
		error = exception.getError()
	else if (exception instanceof BadRequestException) // pour les DTO
	{
		  error = exception.getResponse();
		  if (typeof (error) == 'object')
			  error = error.message[0]; // a chaque fois on prend juste le premier pour assurere un meilleur formatage
	}
	  else if (exception instanceof HttpException)
		  error = exception.getResponse();
	  else if (exception instanceof QueryFailedError)
		  error = "Query failed [" + exception.parameters + "] : " + exception.message;
	const details = error instanceof Object ? { ...error } : { message: error };
	client.emit("error", { event : error, data : data })
  }
}


