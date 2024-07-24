export interface Category {
  Topics: string[];
}

export interface GetAllCategoriesAPIResponse {
  category: {
    [key: string]: Category;
  };
}
