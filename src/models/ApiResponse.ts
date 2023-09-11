export interface ApiData {
  type: string,
  id: string
}

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
    finished: boolean,
    type: string,
    group: string,
    promote: number,
    relegate: number,
    score: number,
    value: number,
    active: boolean;
    drawing_points: number
    duration: any;
    edit_points: boolean;
    finish_signature: boolean;
    losing_points: number;
    match_visible_attendances: boolean;
    match_visible_minute_by_minute: boolean;
    match_visible_observations: boolean;
    match_visible_referees: boolean;
    match_visible_scoreboard: boolean;
    match_visible_stats: boolean;
    period_drawing_points: number;
    period_losing_points: number;
    period_result_type: string;
    period_winning_points: number;
    result_type: string;
    show_periods: boolean;
    updated_at: string;
    winning_points: number;   
  };
  relationships: {
    tournament?: { data?: ApiData},
    group?: { data?: ApiData},
    round?: { data?: ApiData},
    facility?: { data?: ApiData},
    category?: { data?: ApiData},
    match?: { data?: ApiData},
    team?: { data?: ApiData},
    parent?: { data?: ApiData},
    period?: { data?: ApiData},
    periods?: { data?: ApiData[] },
  },
  meta: {
    away_team: string,
    home_team: string,
    avatar: { large: string }
  }
}

export interface ApiListResponse {
  data: ApiResponseData[];
  included: ApiResponseData[];
}

export interface ApiItemResponse {
  data: ApiResponseData;
  included: ApiResponseData[];
}