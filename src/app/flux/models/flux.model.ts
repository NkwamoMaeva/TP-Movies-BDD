export interface Flux {
  author: string;
  author_details: {name: string, username: string, avatar_path: string, rating: number
  },
  content: string,
  created_at: string
}

export interface FluxResult {
  page: number;
  results: Flux[];
}
