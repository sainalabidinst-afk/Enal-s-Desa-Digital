import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { QueryComplaintDto } from './dto/query-complaint.dto';
import { JwtAuthGuard } from '../../core/common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../core/common/decorators/permissions.decorator';

@ApiTags('Complaints')
@Controller('complaints')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  @RequirePermissions('complaint:create')
  @ApiOperation({ summary: 'Create new complaint' })
  create(@Body() createComplaintDto: CreateComplaintDto, @Query('userId') userId: string) {
    return this.complaintService.create(createComplaintDto, userId);
  }

  @Get()
  @RequirePermissions('complaint:read')
  @ApiOperation({ summary: 'Get all complaints with pagination' })
  findAll(@Query() query: QueryComplaintDto) {
    return this.complaintService.findAll(query);
  }

  @Get('tracking/:trackingNumber')
  @ApiOperation({ summary: 'Get complaint by tracking number' })
  findByTrackingNumber(@Param('trackingNumber') trackingNumber: string) {
    return this.complaintService.findByTrackingNumber(trackingNumber);
  }

  @Get(':id/timeline')
  @RequirePermissions('complaint:read')
  @ApiOperation({ summary: 'Get complaint timeline' })
  getTimeline(@Param('id') id: string) {
    return this.complaintService.getTimeline(id);
  }

  @Get(':id')
  @RequirePermissions('complaint:read')
  @ApiOperation({ summary: 'Get complaint by ID' })
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('complaint:update')
  @ApiOperation({ summary: 'Update complaint' })
  update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto, @Query('userId') userId: string) {
    return this.complaintService.update(id, updateComplaintDto, userId);
  }
}
