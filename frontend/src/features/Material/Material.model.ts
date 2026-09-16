export interface MaterialModelBase {
  name: string;
  description?: string;
}

export interface MaterialModel extends MaterialModelBase {
  materialType: string;
}

export type MaterialDTO = MaterialModel;
