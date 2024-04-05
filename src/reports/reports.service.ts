import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { ApproveReportDTO } from './dtos/approve-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async createReport(reportDto: CreateReportDTO, user: User): Promise<Report> {
    const newReport = this.reportRepository.create({ ...reportDto });
    newReport.user = user;
    return await this.reportRepository.save(newReport);
  }

  async changeApproval(
    reportId: number,
    approveReport: ApproveReportDTO,
  ): Promise<Report> {
    const existingReport = await this.reportRepository.findOne({
      where: {
        id: reportId,
      },
    });

    if (!existingReport) {
      throw new NotFoundException('Report not found');
    }

    existingReport.approved = approveReport.approve;

    return await this.reportRepository.save(existingReport);
  }
}
