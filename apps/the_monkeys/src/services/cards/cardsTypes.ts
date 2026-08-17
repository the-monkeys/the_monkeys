// Wire types for the business-card gateway endpoints (/api/v1/user/cards).
// Timestamps arrive as protobuf Timestamp objects ({seconds, nanos}) because
// the gateway marshals the gRPC response struct directly, matching how the
// user-profile endpoints already behave.

export interface ProtoTimestamp {
  seconds?: number | string;
  nanos?: number;
}

export interface ServerBusinessCard {
  id: string;
  account_id: string;
  name: string;
  template_id: string;
  theme_id: string;
  /** Full editor document, serialized JSON string. */
  card_state: string;
  is_default: boolean;
  avatar_asset_checksum?: string;
  logo_asset_checksum?: string;
  created_at?: ProtoTimestamp | string;
  updated_at?: ProtoTimestamp | string;
}

export interface ListBusinessCardsResponse {
  cards?: ServerBusinessCard[];
}

export interface DeleteBusinessCardResponse {
  status?: string;
  message?: string;
}
