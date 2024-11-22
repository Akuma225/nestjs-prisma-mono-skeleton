import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    this.logger.error(exception);

    const meta: any = exception.meta;
    this.logger.log({ meta });

    if (meta.target?.includes('contact')) {
      const status = HttpStatus.CONFLICT;

      throw new HttpException('Un utilisateur possède déjà ce numéro.', status);
    } else if (meta.target?.includes('email')) {
      const status = HttpStatus.CONFLICT;

      throw new HttpException('Un utilisateur possède déjà cet email.', status);
    } else if (meta.target?.includes('slug')) {
      const status = HttpStatus.CONFLICT;

      throw new HttpException('Un utilisateur possède déjà ce nom.', status);
    } else if (meta.cause.includes('Record to delete does not exist')) {
      const status = HttpStatus.NOT_FOUND;

      throw new HttpException("La ressource n'existe pas.", status);
    } else if (meta.message.includes('Error creating UUID')) {
      const status = HttpStatus.BAD_REQUEST;

      throw new HttpException(
        "La donnée passée en paramètre n'est pas correcte.",
        status,
      );
    } else {
      super.catch(exception, host);
    }
  }
}
