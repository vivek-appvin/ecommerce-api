import { ExecutionContext } from '@nestjs/common';
declare const CustomerGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class CustomerGuard extends CustomerGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
