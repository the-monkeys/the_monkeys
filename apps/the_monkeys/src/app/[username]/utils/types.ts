export type Params = Promise<{ username: string }>;

export interface ProfileLayoutProps {
  children: React.ReactNode;
  params: Params;
}
