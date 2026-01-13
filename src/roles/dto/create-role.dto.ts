import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum RoleName {
  USER = 'USER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(RoleName)
  name: RoleName; // Role name: USER | SELLER | ADMIN
}
