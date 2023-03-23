export interface RatingTest {
    id_user: string;
    rating: number,
    id_movie: string,
    date_created: string,
  }
  
  export interface RatingTestResult {
    page: number;
    results: RatingTest[];
  }
  