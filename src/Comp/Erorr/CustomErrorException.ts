import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ErrorMessages from './error.maps';

export default class CustomErrorException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, property: string = '') {
    super(
      {
        message,
        property,
      },
      statusCode,
    );
  }

  static handle(error: Error, property?: string) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
        case 'P2016':
          throw new CustomErrorException(
            ErrorMessages.NOT_FOUND,
            HttpStatus.NOT_FOUND,
            property,
          );
        case 'P2021':
          throw new CustomErrorException(
            ErrorMessages.DATABASE_CONNECTION_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
            property,
          );
        case 'P2002':
          throw new CustomErrorException(
            ErrorMessages.EXISTS,
            HttpStatus.CONFLICT,
            property,
          );
        default:
          throw new CustomErrorException(
            error.message,
            HttpStatus.BAD_REQUEST,
            property,
          );
      }
    }else if (error.message === ErrorMessages.UNAUTHORIZED) {
        const customErrorMessage = 'This is my custom unauthorized error message';
        throw new CustomErrorException(
          customErrorMessage,
          HttpStatus.UNAUTHORIZED,
          property,
        );
      }else if (error.message === ErrorMessages.FORBIDDEN) {
      throw new CustomErrorException(
        ErrorMessages.FORBIDDEN,
        HttpStatus.FORBIDDEN,
        property,
      );
    } else if (error.message === ErrorMessages.VALIDATION_ERROR) {
      throw new CustomErrorException(
        ErrorMessages.VALIDATION_ERROR,
        HttpStatus.UNPROCESSABLE_ENTITY,
        property,
      );
    } else if (error.message === ErrorMessages.TIMEOUT_ERROR) {
      throw new CustomErrorException(
        ErrorMessages.TIMEOUT_ERROR,
        HttpStatus.REQUEST_TIMEOUT,
        property,
      );
    } else if (error.message === ErrorMessages.CONFLICT) {
      throw new CustomErrorException(
        ErrorMessages.CONFLICT,
        HttpStatus.CONFLICT,
        property,
      );
    } else if (error.message === ErrorMessages.BAD_REQUEST) {
      throw new CustomErrorException(
        ErrorMessages.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
        property,
      );
    } else if (error.message === ErrorMessages.INTERNAL_SERVER_ERROR) {
      throw new CustomErrorException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        property,
      );
    } else if (error.message === ErrorMessages.SERVICE_UNAVAILABLE) {
      throw new CustomErrorException(
        ErrorMessages.SERVICE_UNAVAILABLE,
        HttpStatus.SERVICE_UNAVAILABLE,
        property,
      );
    } else if (error.message === ErrorMessages.METHOD_NOT_ALLOWED) {
      throw new CustomErrorException(
        ErrorMessages.METHOD_NOT_ALLOWED,
        HttpStatus.METHOD_NOT_ALLOWED,
        property,
      );
    } else if (error.message === ErrorMessages.RATE_LIMIT_EXCEEDED) {
      throw new CustomErrorException(
        ErrorMessages.RATE_LIMIT_EXCEEDED,
        HttpStatus.TOO_MANY_REQUESTS,
        property,
      );
    } else if (error.message === ErrorMessages.PAYLOAD_TOO_LARGE) {
      throw new CustomErrorException(
        ErrorMessages.PAYLOAD_TOO_LARGE,
        HttpStatus.PAYLOAD_TOO_LARGE,
        property,
      );
    } else if (error.message === ErrorMessages.FILE_TOO_LARGE) {
      throw new CustomErrorException(
        ErrorMessages.FILE_TOO_LARGE,
        HttpStatus.PAYLOAD_TOO_LARGE,
        property,
      );
    } else if (error.message === ErrorMessages.UNSUPPORTED_FILE_TYPE) {
      throw new CustomErrorException(
        ErrorMessages.UNSUPPORTED_FILE_TYPE,
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        property,
      );
    } else if (error.message === ErrorMessages.PAYMENT_REQUIRED) {
      throw new CustomErrorException(
        ErrorMessages.PAYMENT_REQUIRED,
        HttpStatus.PAYMENT_REQUIRED,
        property,
      );
    } else if (error.message === ErrorMessages.ACCOUNT_LOCKED) {
      throw new CustomErrorException(
        ErrorMessages.ACCOUNT_LOCKED,
        HttpStatus.FORBIDDEN,
        property,
      );
    } else if (error.message === ErrorMessages.INVALID_CREDENTIALS) {
      throw new CustomErrorException(
        ErrorMessages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
        property,
      );
    }
    
    else if (error.message === ErrorMessages.TEST){

        throw new CustomErrorException(
            ErrorMessages.TEST,
            HttpStatus.UNAUTHORIZED,
            property,
        )
    }
    else {
      throw new CustomErrorException(
        ErrorMessages.UNKNOWN_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        property,
      );
    }
  }
}
