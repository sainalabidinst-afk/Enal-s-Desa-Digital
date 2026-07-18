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
import { LetterService } from './letter.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { QueryLetterDto } from './dto/query-letter.dto';
import { JwtAuthGuard } from '../../core/common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../core/common/decorators/permissions.decorator';

@ApiTags('Letters')
@Controller('letters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post()
  @RequirePermissions('letter:create')
  @ApiOperation({ summary: 'Create new letter' })
  create(@Body() createLetterDto: CreateLetterDto, @Query('userId') userId: string) {
    return this.letterService.create(createLetterDto, userId);
  }

  @Get()
  @RequirePermissions('letter:read')
  @ApiOperation({ summary: 'Get all letters with pagination' })
  findAll(@Query() query: QueryLetterDto) {
    return this.letterService.findAll(query);
  }

  @Get('types')
  @RequirePermissions('letter:read')
  @ApiOperation({ summary: 'Get all letter types' })
  getLetterTypes() {
    return this.letterService.getLetterTypes();
  }

  @Get(':id')
  @RequirePermissions('letter:read')
  @ApiOperation({ summary: 'Get letter by ID' })
  findOne(@Param('id') id: string) {
    return this.letterService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('letter:update')
  @ApiOperation({ summary: 'Update letter' })
  update(@Param('id') id: string, @Body() updateLetterDto: UpdateLetterDto, @Query('userId') userId: string) {
    return this.letterService.update(id, updateLetterDto, userId);
  }
}
