import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from './request-context.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req['user'] = decoded; // Assuming the user ID is stored in `sub`
      } catch (err) {
        console.error(err);
      }
    }
    this.requestContextService.setRequest(req);
    next();
  }
}
