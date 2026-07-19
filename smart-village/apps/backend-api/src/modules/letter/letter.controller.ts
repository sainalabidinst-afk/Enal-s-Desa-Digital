import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LetterService } from './letter.service';
import { JwtAuthGuard } from '../../core/common/guards/jwt-auth.guard';

@ApiTags('Letters')
@Controller('letters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post()
  @ApiOperation({ summary: 'Create new letter' })
  create(@Body() body: { citizenId: string; letterTypeId: string; subject: string; content?: string }, @Request() req: any) {
    return this.letterService.create(body, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all letters with pagination' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('citizenId') citizenId?: string,
  ) {
    return this.letterService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      status,
      citizenId,
    });
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all letter types' })
  getLetterTypes() {
    return this.letterService.getLetterTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get letter by ID' })
  findOne(@Param('id') id: string) {
    return this.letterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update letter' })
  update(@Param('id') id: string, @Body() body: { subject?: string; content?: string; status?: string }, @Request() req: any) {
    if (body.status) {
      return this.letterService.updateStatus(id, body.status as any, req.user.id);
    }
    return this.letterService.update(id, body, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete letter' })
  remove(@Param('id') id: string) {
    return this.letterService.remove(id);
  }
}