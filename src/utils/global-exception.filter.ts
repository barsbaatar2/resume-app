import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Extract the exception details
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let fullError: object | null = null;

    // Check if the exception is a standard HTTP exception
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse()['message'] || exception.getResponse();
    } else {
      // Handle other types of exceptions
      //   console.error('Global exception caught:', exception);
      fullError = this.getExceptionDetails(exception);
    }

    // Set the appropriate HTTP status code and send a response
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      fullError: fullError,
    });
  }
  private getExceptionDetails(exception: any): object {
    const properties = Object.getOwnPropertyDescriptors(exception);
    const plainObject = {};

    for (const prop in properties) {
      plainObject[prop] = exception[prop];
    }

    return plainObject;
  }
}
