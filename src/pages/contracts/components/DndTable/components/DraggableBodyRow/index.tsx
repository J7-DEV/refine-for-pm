import React, { useRef, useState, createContext, useEffect } from 'react'
import { DraggableBodyRowProps, DataType } from 'pages/contracts/components/DndTable/interfaces'
import { useDrag, useDrop } from 'react-dnd';
import { IProduct } from 'interfaces';
import { useOne } from '@pankod/refine-core'
import { Form } from '@pankod/refine-antd'
import { nanoid } from 'nanoid'

const type = 'DraggableBodyRow';
export const selectedProductContext = createContext<any>(null)


const DraggableBodyRow = ({
  rowIndex,
  moveRow,
  setDataSource,
  isEditing,
  className,
  style,
  ...restProps
}: DraggableBodyRowProps) => {
  const form = Form.useFormInstance();
  const ref = useRef<HTMLTableRowElement>(null);
  const qty = Form.useWatch(['qty', rowIndex], form)
  const unit_price = Form.useWatch(['unit_price', rowIndex], form)
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { rowIndex: dragIndex } = monitor.getItem() || {};
      if (dragIndex === rowIndex) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < rowIndex ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: { rowIndex: number }) => {
      moveRow(item.rowIndex, rowIndex);
    },
    /* FIXME 拖曳時沒有作用*/
  });
  const [, drag] = useDrag({
    type,
    item: { rowIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  const [selectedProductId, setSelectedProductId] = useState(0)

  const productQueryResult = useOne<IProduct>({
    resource: "products",
    id: selectedProductId,
    queryOptions: {
      enabled: !!selectedProductId,
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 5,
    },
  });


  const { isSuccess: productIsSuccess, isLoading: productIsLoading, isPreviousData } = productQueryResult;
  const selectedProduct = productQueryResult.data?.data
  const selectedContext = {
    setSelectedProductId,
  }


  useEffect(() => {
    if (productIsSuccess) {
      form.setFieldValue(['include', rowIndex], selectedProduct?.include)
      form.setFieldValue(['unit_price', rowIndex], selectedProduct?.unit_price)
      form.setFieldValue(['unit', rowIndex], selectedProduct?.unit)
    }
    if (isEditing) {
      setDataSource((prev: DataType[]) => {
        return prev.map((item: DataType, index) => {
          if (index === rowIndex && !!item) {
            item.unit_price = unit_price
            item.unit = selectedProduct?.unit || '式'
            item.qty = qty
            item.amount = qty * unit_price
          }
          return item
        })
      })
    }
  }, [productIsSuccess, selectedProductId, productIsLoading, isPreviousData, qty, unit_price, isEditing])

  const cursor = isEditing ? 'move' : 'default'

  return (
    <selectedProductContext.Provider value={selectedContext}>
      <tr
        key={rowIndex}
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor, ...style }}
        {...restProps}
      />
    </selectedProductContext.Provider>
  );
};



export default DraggableBodyRow