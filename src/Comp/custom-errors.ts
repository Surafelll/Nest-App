
import { HttpException, HttpStatus } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
// import ErrorMessages from '../maps/error.maps'

export default class ErrorCustomException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, property: string = '') {
    super(
      {
        message,
        property,
      },
      statusCode,
    )
  }
  

//   static handle(error: Error, property?: string) {
//     if (error instanceof PrismaClientKnownRequestError) {
//       switch (error.code) {
//         case 'P2025':
//         case 'P2016':
//           throw new ErrorCustomException(
//             ErrorMessages.NOT_FOUND,
//             HttpStatus.NOT_FOUND,
//             property,
//           )
//         case 'P2021':
//           throw new ErrorCustomException(
//             ErrorMessages.DATABASE_CONNECTION_ERROR,
//             HttpStatus.INTERNAL_SERVER_ERROR,
//             property,
//           )
//         case 'P2002':
//           throw new ErrorCustomException(
//             ErrorMessages.EXISTS,
//             HttpStatus.CONFLICT,
//             property,
//           )
//         default:
//           throw new ErrorCustomException(error.message, 400, property)
//       }
//     } else if (error instanceof ErrorCustomException) {
//       throw error
//     } else {
//       throw new ErrorCustomException('Something went wrong!', 500, property)
//     }
//   }
 }