export type List = {
  release_id: number;
  condition: string;
  sleeve_condition?: string;
  price: number;
  comments?: string;
  allow_offers?: boolean;
  status?: "For Sale" | "Draft";
  external_id?: string;
  location?: string;
  weight?: number;
  format_quantity?: number;
};
