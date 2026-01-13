import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@ApiTags('Sellers')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new seller' })
  @ApiResponse({ status: 201, description: 'Seller created successfully' })
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiResponse({ status: 200, description: 'List of all sellers' })
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a seller by ID' })
  @ApiResponse({ status: 200, description: 'Seller found' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a seller' })
  @ApiResponse({ status: 200, description: 'Seller updated successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a seller' })
  @ApiResponse({ status: 200, description: 'Seller soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }
}
