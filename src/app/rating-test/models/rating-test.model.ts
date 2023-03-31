export interface RatingTest {
  id_user: string;
  rating: number;
  id_movie: number;
  date_created: string;
  comment: string;
}

export interface RatingTestResult {
  page: number;
  results: RatingTest[];
}
