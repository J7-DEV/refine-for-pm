export interface DataType {
  [key: string]: string | number;
  key: string;
  product_id: number | string;
  include: string;
  unit_price: number;
  unit: string;
  qty: number;
  amount: number;
}

export interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  rowIndex: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  setDataSource: React.Dispatch<React.SetStateAction<DataType[]>>;
  isEditing: boolean;
}
