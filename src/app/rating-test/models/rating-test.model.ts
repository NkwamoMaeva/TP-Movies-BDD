export interface RatingTest {
    id_user: string;
    rating: number,
    movie_name: string,
    date_created: string,
  }
  
  export interface RatingTestResult {
    page: number;
    results: RatingTest[];
  }
  