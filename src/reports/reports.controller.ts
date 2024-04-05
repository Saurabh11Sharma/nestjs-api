import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDTO } from './dtos/report.dto';
import { Report } from './report.entity';
import { ApproveReportDTO } from './dtos/approve-report.dto';

@Controller('reports')
@UseGuards(AuthGuard)
@Serialize(ReportDTO)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('/create')
  async createReport(
    @Body() createReportDTO: CreateReportDTO,
    @CurrentUser() user: User,
  ): Promise<Report> {
    return await this.reportsService.createReport(createReportDTO, user);
  }

  @Patch('/:id')
  async changeApproval(
    @Param('id') id: string,
    @Body() approveReport: ApproveReportDTO,
  ): Promise<Report> {
    return await this.reportsService.changeApproval(
      parseInt(id),
      approveReport,
    );
  }
}
