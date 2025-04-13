export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
