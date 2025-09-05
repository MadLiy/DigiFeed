import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { appendFileSync, createWriteStream, existsSync } from 'fs';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;

    console.log(`[${timestamp}] ${method} ${url}`);

    let path: string = 'dev.log';

    if (!existsSync(path)) {
      let stream = createWriteStream(path);
      stream.on('open', () => {
        stream.write(`[${timestamp}] ${method} ${url}`);
        stream.close();
      });
    } else {
      appendFileSync(path, `\n[${timestamp}] ${method} ${url}`);
    }

    next();
  }
}
