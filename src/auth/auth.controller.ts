import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new auth record' })
  @ApiResponse({ status: 201, description: 'Auth record created successfully' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all auth records' })
  @ApiResponse({ status: 200, description: 'List of all auth records' })
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an auth record by ID' })
  @ApiResponse({ status: 200, description: 'Auth record found' })
  @ApiResponse({ status: 404, description: 'Auth record not found' })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an auth record' })
  @ApiResponse({ status: 200, description: 'Auth record updated successfully' })
  @ApiResponse({ status: 404, description: 'Auth record not found' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an auth record' })
  @ApiResponse({ status: 200, description: 'Auth record soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Auth record not found' })
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
