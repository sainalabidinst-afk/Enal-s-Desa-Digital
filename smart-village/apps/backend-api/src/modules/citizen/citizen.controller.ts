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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CitizenService } from './citizen.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { QueryCitizenDto } from './dto/query-citizen.dto';
import { JwtAuthGuard } from '../../core/common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../core/common/decorators/permissions.decorator';

@ApiTags('Citizens')
@Controller('citizens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CitizenController {
  constructor(private readonly citizenService: CitizenService) {}

  @Post()
  @RequirePermissions('citizen:create')
  @ApiOperation({ summary: 'Create new citizen' })
  create(@Body() createCitizenDto: CreateCitizenDto) {
    return this.citizenService.create(createCitizenDto);
  }

  @Get()
  @RequirePermissions('citizen:read')
  @ApiOperation({ summary: 'Get all citizens with pagination' })
  findAll(@Query() query: QueryCitizenDto) {
    return this.citizenService.findAll(query);
  }

  @Get('stats')
  @RequirePermissions('citizen:read')
  @ApiOperation({ summary: 'Get citizen statistics' })
  getStats() {
    return this.citizenService.getStats();
  }

  @Get('nik/:nik')
  @RequirePermissions('citizen:read')
  @ApiOperation({ summary: 'Get citizen by NIK' })
  findByNIK(@Param('nik') nik: string) {
    return this.citizenService.findByNIK(nik);
  }

  @Get(':id')
  @RequirePermissions('citizen:read')
  @ApiOperation({ summary: 'Get citizen by ID' })
  findOne(@Param('id') id: string) {
    return this.citizenService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('citizen:update')
  @ApiOperation({ summary: 'Update citizen' })
  update(@Param('id') id: string, @Body() updateCitizenDto: UpdateCitizenDto) {
    return this.citizenService.update(id, updateCitizenDto);
  }

  @Delete(':id')
  @RequirePermissions('citizen:delete')
  @ApiOperation({ summary: 'Delete citizen' })
  remove(@Param('id') id: string) {
    return this.citizenService.remove(id);
  }
}
