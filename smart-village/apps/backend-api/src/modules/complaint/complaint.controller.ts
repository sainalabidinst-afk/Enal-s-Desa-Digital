import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ComplaintService, ComplaintStatus, ComplaintCategory } from './complaint.service';
import { JwtAuthGuard } from '../../core/common/guards/jwt-auth.guard';

@ApiTags('Complaints')
@Controller('complaints')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  @ApiOperation({ summary: 'Create new complaint' })
  create(@Body() body: { citizenId: string; category: ComplaintCategory; subject: string; description: string }, @Request() req: any) {
    return this.complaintService.create(body, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all complaints' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.complaintService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complaint by ID' })
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update complaint status' })
  updateStatus(@Param('id') id: string, @Body() body: { status: ComplaintStatus }, @Request() req: any) {
    return this.complaintService.updateStatus(id, body.status, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete complaint' })
  remove(@Param('id') id: string) {
    return this.complaintService.remove(id);
  }
}