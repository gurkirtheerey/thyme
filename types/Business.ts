export type Business = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
