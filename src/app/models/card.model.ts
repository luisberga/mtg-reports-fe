export interface Card {
  id: number;
  name: string;
  set: string;
  collector_number: string;
  foil: boolean;
  last_price: number;
  old_price: number;
  price_change: number;
  last_update: string;
}

export interface CreateCardRequest {
  name: string;
  set_name: string;
  collector_number: string;
  foil: boolean;
}

export interface UpdateCardRequest {
  name?: string;
}

export interface BulkInsertResponse {
  processed: number;
  not_processed: number;
}

export interface CardHistory {
  id: number;
  name: string;
  set: string;
  collector_number: string;
  foil: boolean;
  last_price: number;
  old_price: number;
  price_change: number;
  last_update: string;
}

export interface CardFilters {
  name?: string;
  set_name?: string;
  collector_number?: string;
  foil?: boolean;
  min_price?: number;
  max_price?: number;
  rarity?: string;
  color?: string;
}

export interface ScryfallCard {
  id: string;
  name: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  mana_cost?: string;
  cmc?: number;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity?: string[];
  rarity?: string;
  set: string;
  collector_number: string;
}

export interface PaginatedCardsResponse {
  cards: Card[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
} 