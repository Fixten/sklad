interface DbFields {
  id: number;
  created_at: Date;
  updated_at: Date | null;
}

export type WithDb<T extends object> = T & DbFields;
