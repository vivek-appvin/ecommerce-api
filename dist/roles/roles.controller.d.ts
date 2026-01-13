import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<import("./role.entity").RoleEntity>;
    findAll(): Promise<import("./role.entity").RoleEntity[]>;
    findOne(id: string): Promise<import("./role.entity").RoleEntity>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<import("./role.entity").RoleEntity>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
