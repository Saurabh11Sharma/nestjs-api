import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

describe('ReportsService', () => {
  let service: ReportsService;
  let queryBuilder: any;
  let reportRepository: any;

  const estimateQuery: GetEstimateDTO = {
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    mileage: 35000,
    lat: 28.6,
    lng: 77.2,
  };

  beforeEach(() => {
    queryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    reportRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    service = new ReportsService(reportRepository as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the average price of the closest approved comparable reports', async () => {
    queryBuilder.getMany.mockResolvedValue([
      { id: 1, price: 100000 },
      { id: 2, price: 120000 },
      { id: 3, price: 110000 },
    ] as Report[]);

    await expect(service.getEstimate(estimateQuery)).resolves.toBe(110000);

    expect(reportRepository.createQueryBuilder).toHaveBeenCalledWith('report');
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'report.make = :make',
      { make: 'Toyota' },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'report.model = :model',
      { model: 'Corolla' },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'report.approved = :approved',
      { approved: true },
    );
    expect(queryBuilder.orderBy).toHaveBeenCalledWith(
      'ABS(report.mileage - :mileage)',
      'ASC',
    );
    expect(queryBuilder.setParameter).toHaveBeenCalledWith('mileage', 35000);
    expect(queryBuilder.limit).toHaveBeenCalledWith(10);
  });

  it('returns null when there are no comparable approved reports', async () => {
    queryBuilder.getMany.mockResolvedValue([]);

    await expect(service.getEstimate(estimateQuery)).resolves.toBeNull();
  });
});
