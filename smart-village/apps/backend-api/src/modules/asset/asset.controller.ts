import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssetService, AssetCondition } from './asset.service';
import { JwtAuthGuard } from '../../core/common/guards/jwt-auth.guard';

@ApiTags('Assets')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @ApiOperation({ summary: 'Create new asset' })
  create(@Body() body: { villageId: string; code: string; name: string; category: string; condition?: string }) {
    return this.assetService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets with pagination' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('condition') condition?: string,
    @Query('villageId') villageId?: string,
  ) {
    return this.assetService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      category,
      condition,
      villageId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset by ID' })
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update asset' })
  update(@Param('id') id: string, @Body() body: { code?: string; name?: string; category?: string; condition?: string }) {
    return this.assetService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete asset' })
  remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }
}
