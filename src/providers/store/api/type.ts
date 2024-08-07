import { StringUnion } from "../../../type";

export enum LocalStorageItemKey {
  TOKEN = "token",
  REFRESH_TOKEN = "refreshToken",
}

export interface PaginationType {
  page: number;
  totalRecords: number;
  limitRecordsPerPage: number;
  numPages: number;
}

export interface PaginationResponse<T> {
  data: T;
  pagination: PaginationType;
}

export interface ListResponse<T> {
  data: T;
}

export interface ErrorData {
  field: string;
  message: string;
}

export enum Role {
  ADMIN = "admin",
  ACCOUNTANT = "accountant",
  FINANCIAL_STAFF = "financial-staff",
}

export const ExpenseStatusCodes = StringUnion(
  "WAITING_FOR_APPROVAL",
  "APPROVED",
  "DENIED"
);

export type ExpenseStatusCode = typeof ExpenseStatusCodes.type;

export interface Expense {
  expenseId: number;
  name: string;
  costType: CostType;
  unitPrice: number;
  amount: number;
  projectName: string;
  supplierName: string;
  pic: string;
  notes: string;
  status: ExpenseStatus;
}

export interface ExpenseStatus {
  statusId: number;
  code: ExpenseStatusCode;
  name: string;
}

export interface CostType {
  costTypeId: number;
  name: string;
}
