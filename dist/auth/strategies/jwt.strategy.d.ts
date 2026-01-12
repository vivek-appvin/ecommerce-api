import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
export interface JwtPayload {
    sub: string;
    role: string;
    phone_number: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userRepository;
    constructor(configService: ConfigService, userRepository: Repository<UserEntity>);
    validate(payload: JwtPayload): Promise<{
        id: string;
        phone_number: string;
        email: string | null;
        role: import("../../roles/role.entity").RoleName;
    }>;
}
export {};
