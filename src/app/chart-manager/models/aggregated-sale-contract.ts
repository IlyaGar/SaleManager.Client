import { IntervalType } from "./interval-type";

export interface AggregatedSaleContract {
  periodStart: string;
  sumInThousands: number;
  totalCount: number;
  intervalType: IntervalType;
}