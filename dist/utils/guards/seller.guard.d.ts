import { ExecutionContext } from '@nestjs/common';
declare const SellerGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class SellerGuard extends SellerGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
