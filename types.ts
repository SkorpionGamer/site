export interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  tags: string[];
  description: string; // Static description
}

export interface CartItem extends ArtPiece {
  quantity: number;
}

export interface GeminiAnalysis {
  critique: string;
  mood: string;
  suggestedPairing: string;
}
