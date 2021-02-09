export interface ApiResponse<T> {
  data: T;
  successful: boolean;
  failed: boolean;
  alerts: any[];
}
