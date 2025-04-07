export interface AppResponseModel<T> {
  message: string;
  status: boolean;
  data: T;
}

export interface IResponseStatus {
  message: string;
  status: number;
}
