import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { GetEstimateDTO } from './dtos/get-estimate.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async changeApproval(
    reportId: number,
    approveReport: ApproveReportDTO,
  ): Promise<Report> {
    const existingReport = await this.reportRepository.findOne({
      where: { id: reportId },
    });

    if (!existingReport) {
      throw new NotFoundException('Report not found');
    }

    existingReport.approved = approveReport.approve;

    return this.reportRepository.save(existingReport);
  }

  async createReport(reportDto: CreateReportDTO, user: User): Promise<Report> {
    const newReport = this.reportRepository.create({ ...reportDto });
    newReport.user = user;
    return this.reportRepository.save(newReport);
  }

  async getEstimate(estimateQuery: GetEstimateDTO): Promise<number | null> {
    const { make, model, year, mileage, lat, lng } = estimateQuery;

    const comparableReports = await this.reportRepository
      .createQueryBuilder('report')
      .where('report.make = :make', { make })
      .andWhere('report.model = :model', { model })
      .andWhere('ABS(report.year - :year) <= :yearTolerance', {
        year,
        yearTolerance: 3,
      })
      .andWhere('ABS(report.lat - :lat) <= :coordinateTolerance', {
        lat,
        coordinateTolerance: 5,
      })
      .andWhere('ABS(report.lng - :lng) <= :coordinateTolerance', {
        lng,
        coordinateTolerance: 5,
      })
      .andWhere('report.approved = :approved', { approved: true })
      .orderBy('ABS(report.mileage - :mileage)', 'ASC')
      .setParameter('mileage', mileage)
      .limit(10)
      .getMany();

    if (comparableReports.length === 0) {
      return null;
    }

    const totalPrice = comparableReports.reduce(
      (total, report) => total + Number(report.price),
      0,
    );

    return totalPrice / comparableReports.length;
  }
}
