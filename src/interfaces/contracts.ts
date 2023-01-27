import { DataType } from "pages/contracts/components/DndTable/interfaces";

export interface IContracts {
  id: number;
  name: string;
  status: string;
  client_id: string;
  products: DataType[];
  total_price: number;
  tax: boolean;
  created_at: string;
  edited_at: string;
  edited_by: string;
  version: number;
}
