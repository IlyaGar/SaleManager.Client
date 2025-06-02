import { IntervalType } from "./interval-type";

export interface FilterContract {
  startDate: string;
  endDate: string;
  intervalType: IntervalType;
}