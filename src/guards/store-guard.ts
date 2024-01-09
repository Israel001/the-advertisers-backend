import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserType } from 'src/types';

@Injectable()
export class StoreGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user.type !== UserType.STORE)
      throw new ForbiddenException('Only Store User is allowed');
    return true;
  }
}
