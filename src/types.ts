export interface Profile {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  wca_id: string;
  gender: string;
  country_iso2: string;
  url: string;
  country: {
    id: string;
    name: string;
    continentId: string;
    iso2: string;
  };
  delegate_status: string;
  email: string;
  location: string;
  region_id: number;
  class: string;
  teams: {
    id: number;
    friendly_id: string;
    leader: boolean;
    senior_member: boolean;
    name: string;
    wca_id: string;
    avatar: {
      url: string;
      thumb: {
        url: string;
      };
    };
  }[];
  avatar: {
    url: string;
    pending_url: string;
    thumb_url: string;
    is_default: boolean;
  };
  dob: string;
}

export interface Tokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}
