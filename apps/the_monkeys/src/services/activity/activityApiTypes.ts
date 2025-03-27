export type Activity = {
  timestamp: Date;
  description: string;
};

export interface GetAllActivityAPIResponse {
  response: Activity[];
}
