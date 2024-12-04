import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export default class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as 
      | string 
      | { message: any; error: string }
      | { [key: string]: any };
    const errorResponse =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : exceptionResponse;
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorResponse.message,
      error: errorResponse.error,
    });
  }
}
