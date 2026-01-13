import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin record' })
  @ApiResponse({ status: 201, description: 'Admin record created successfully' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admin records' })
  @ApiResponse({ status: 200, description: 'List of all admin records' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an admin record by ID' })
  @ApiResponse({ status: 200, description: 'Admin record found' })
  @ApiResponse({ status: 404, description: 'Admin record not found' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an admin record' })
  @ApiResponse({ status: 200, description: 'Admin record updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin record not found' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an admin record' })
  @ApiResponse({ status: 200, description: 'Admin record soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin record not found' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
