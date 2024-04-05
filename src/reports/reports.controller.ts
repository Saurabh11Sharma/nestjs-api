import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDTO } from './dtos/report.dto';
import { Report } from './report.entity';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
@Serialize(ReportDTO)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async changeApproval(
    @Param('id') id: string,
    @Body() approveReport: ApproveReportDTO,
  ): Promise<Report> {
    return await this.reportsService.changeApproval(
      parseInt(id),
      approveReport,
    );
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  async createReport(
    @Body() createReportDTO: CreateReportDTO,
    @CurrentUser() user: User,
  ): Promise<Report> {
    return await this.reportsService.createReport(createReportDTO, user);
  }

  @Get('/estimate')
  @UseGuards(AuthGuard)
  async getEstimate(
    @Query() estimateQuery: GetEstimateDTO,
  ): Promise<number | null> {
    return await this.reportsService.getEstimate(estimateQuery);
  }
}
