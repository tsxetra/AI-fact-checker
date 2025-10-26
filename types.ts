
export interface GroundingChunk {
  web?: {
    uri: string;
    title:string;
  };
}

export interface SearchResultItem {
  id: string;
  query: string;
  response: string;
  sources: GroundingChunk[];
}
