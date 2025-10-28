export enum AlertType {
  SUCCESS,
  WARNING,
  ERROR
}

export interface Alert {
  type: AlertType;
  message: string;
}
