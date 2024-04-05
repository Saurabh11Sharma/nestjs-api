import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDTO {
  @IsNumber()
  @Min(0)
  @Max(10000000)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(2001)
  @Max(2050)
  year: number;

  @IsNumber()
  @IsLatitude()
  lat: number;

  @IsNumber()
  @IsLongitude()
  lng: number;

  @IsNumber()
  @Min(0)
  @Max(10000000)
  mileage: number;
}
