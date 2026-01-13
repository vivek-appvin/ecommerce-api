import { Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesService {
    private readonly roleRepository;
    constructor(roleRepository: Repository<RoleEntity>);
    create(createRoleDto: CreateRoleDto): Promise<RoleEntity>;
    findAll(): Promise<RoleEntity[]>;
    findOne(id: string): Promise<RoleEntity>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntity>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
