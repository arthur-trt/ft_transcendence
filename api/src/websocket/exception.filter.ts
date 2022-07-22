import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { QueryFailedError } from "typeorm";
import { Socket } from "socket.io";

// @Catch(HttpException)
// export class AllExceptionsFilter extends BaseWsExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
// 	  super.catch(exception, host);
// 	  console.log("HEY");
//   }
// }


// @Catch(HttpException)
// export class AllExceptionsFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
// 	  console.log(exception)

// 	const test = host.getArgByIndex(5);	  //const response: Response = ctx.getResponse<Response>();
// 	console.log(host.switchToHttp().getResponse())
// 	//test.status(100);

// 	//   const response: Response = host.switchToWs.<Response>();
// 	//   response.status(32);
// 	 // console.log("REEPONSE IS " + response + "haha")
// 	//return res.status("LOL");
//   }
// }


@Catch(WsException, HttpException, QueryFailedError)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException | QueryFailedError, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    const data = host.switchToWs().getData();
	let error;
	  if (exception instanceof WsException)
		  error = exception.getError()
	  else if (exception instanceof HttpException)
		  error = exception.getResponse();
	  else if (exception instanceof QueryFailedError)
		  error = exception.message;
	const details = error instanceof Object ? { ...error } : { message: error };
	client.emit("error", { event : error, data : data })
  }
}
