type SearchUser = {
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
};

interface GetUserSearchResponse {
  users: SearchUser[] | null;
}
