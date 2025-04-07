export interface Category {
  Topics: string[];
}

export interface Topic {
  topic: string;
  category: string;
}

export interface GetAllTopicsAPIResponse {
  topics: Topic[];
}

export interface GetAllCategoriesAPIResponse {
  category: {
    [key: string]: Category;
  };
}
