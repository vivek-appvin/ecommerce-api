import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { RoleName } from '../../roles/role.entity';

@Injectable()
export class SellerGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = super.canActivate(context);
    let isAuthenticated: boolean;
    
    if (result instanceof Observable) {
      isAuthenticated = await firstValueFrom(result);
    } else if (result instanceof Promise) {
      isAuthenticated = await result;
    } else {
      isAuthenticated = result;
    }
    
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role === RoleName.SELLER;
  }
}
