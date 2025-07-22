
export type Language = 'en' | 'ru';

export interface Specification {
  name: string;
  value: string;
}

export interface ProductInfo {
  productName: string;
  brand: string;
  model: string;
  description?: string;
  imageUrl?: string;
  specifications: Specification[];
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface BulkResultItem {
  query: string;
  product: ProductInfo | null;
  sources: GroundingChunk[];
  error?: string;
}