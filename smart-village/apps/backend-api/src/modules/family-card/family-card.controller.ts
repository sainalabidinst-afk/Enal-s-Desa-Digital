import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FamilyCardService } from './family-card.service';
import { JwtAuthGuard } from '../../core/common/guards/jwt-auth.guard';

@ApiTags('Family Cards')
@Controller('family-cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FamilyCardController {
  constructor(private readonly familyCardService: FamilyCardService) {}

  @Get()
  @ApiOperation({ summary: 'Get all family cards' })
  findAll(
    @Query('villageId') villageId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.familyCardService.findAll({
      villageId,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('nkk/:nkk')
  @ApiOperation({ summary: 'Get family card by NKK' })
  findByNKK(@Param('nkk') nkk: string) {
    return this.familyCardService.findByNKK(nkk);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get family card by ID' })
  findOne(@Param('id') id: string) {
    return this.familyCardService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create family card' })
  create(@Body() body: { nkk: string; headName: string; address: string; rt: string; rw: string; villageId: string; hamlet?: string }) {
    return this.familyCardService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update family card' })
  update(@Param('id') id: string, @Body() body: { headName?: string; address?: string; rt?: string; rw?: string; hamlet?: string }) {
    return this.familyCardService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete family card' })
  remove(@Param('id') id: string) {
    return this.familyCardService.remove(id);
  }
}