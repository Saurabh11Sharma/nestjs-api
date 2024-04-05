import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

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

  async createReport(reportDto: CreateReportDTO, user: User): Promise<Report> {
    const newReport = this.reportRepository.create({ ...reportDto });
    newReport.user = user;
    return await this.reportRepository.save(newReport);
  }

  async getEstimate(estimateQuery: GetEstimateDTO): Promise<number | null> {
    const { make, model, year, mileage, lat, lng } = estimateQuery;

    const response = await this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('make = :model', { model })
      .andWhere('lat - :lat BETWEEN - 5 AND 5', { lat })
      .andWhere('lng - :lng BETWEEN - 5 AND 5', { lng })
      .andWhere('make - :year BETWEEN - 3 AND 3', { year })
      .andWhere('approve IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(10)
      .getRawOne();

    return response;
  }
}
