export interface ApiData {
  type: string,
  id: string
}

export interface ApiResponseData {
  id: string;
  type: string;
  attributes: {
    name: string,
    first_name: string,
    last_name: string,
    order: number,
    status: string,
    start_date: string,
    end_date: string,
    date: string,
    finished: boolean,
    postponed: boolean,
    canceled: boolean,
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
    first_text: string;
    second_text: string;
    winner: string;
  };
  relationships: {
    tournament?: { data?: ApiData},
    group?: { data?: ApiData},
    round?: { data?: ApiData},
    facility?: { data?: ApiData},
    category?: { data?: ApiData},
    match?: { data?: ApiData},
    team?: { data?: ApiData},
    registrable?: { data?: ApiData},
    parent?: { data?: ApiData},
    period?: { data?: ApiData},
    periods?: { data?: ApiData[] },
    first_team: { data?: ApiData},
    second_team: { data?: ApiData},
    faceoff?: { data?: ApiData},
    first_previous_faceoff: { data?: ApiData}
    second_previous_faceoff: { data?: ApiData}
  },
  meta: {
    away_team: string,
    home_team: string,
    avatar: { large: string }
  },
  links?: { images?: { image?: { large?: string }}}
}

export interface ApiListResponse {
  data: ApiResponseData[];
  included: ApiResponseData[];
}

export interface ApiItemResponse {
  data: ApiResponseData;
  included: ApiResponseData[];
}
export type StatsType = "score"
  | "played_matches"
  | "won_matches"
  | "drawn_matches"
  | "lost_matches"
  | "value_against"
  | "value_difference"
  | "periods_value_regulation_time"
  | "periods_value_against_regulation_time"
  | "periods_value_difference_regulation_time"
  | "periods_value"
  | "periods_value_against"
  | "periods_value_difference"

export type ApiStandingsResponse = {
  meta: {
    standingsrows: {
      id: string,
      name: string,
      position: number,
      standingsstats: {
        type: StatsType,
        value: number
      } []
    } []
  }
}

export type LiveScoringResponse = {
  team: 'first' | 'second';
  result: string;
  minute: string;
  number: string;
  player: string;
  text: string;
}