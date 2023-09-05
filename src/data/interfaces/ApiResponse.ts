export interface ApiResponseData {
  id: string;
  type: string;
  attributes: {
    name: string,
    order: number,
    status: string,
    start_date: string,
    end_date: string,
    date: string,
    finished: boolean
  };
  relationships: {
    tournament: { data: { type: string, id: string}},
    group: { data: { type: string, id: string}}
    round: { data: { type: string, id: string}}
  },
  meta: {
    away_team: string,
    home_team: string,
  }
}

export interface ApiResponse {
  data: ApiResponseData[];
  included: ApiResponseData[];
}