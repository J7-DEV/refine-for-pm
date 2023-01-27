import React, { useContext } from 'react';
import { Select, useSelect, Input, InputNumber, Form } from '@pankod/refine-antd'
import { DataType } from 'pages/contracts/components/DndTable/interfaces';
import { selectedProductContext } from '../DraggableBodyRow';
import { IProduct } from 'interfaces';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  isEditing: boolean;
  dataIndex: string;
  record: DataType;
  children: React.ReactNode;
  rowIndex: number;
  products: IProduct[];
}

const EditableCell: React.FC<EditableCellProps> = ({
  isEditing,
  record,
  dataIndex,
  children,
  rowIndex,
  products,
  ...restProps
}) => {
  const form = Form.useFormInstance();
  const qty = Form.useWatch(['qty', rowIndex], form)
  const unit_price = Form.useWatch(['unit_price', rowIndex], form)



  const { setSelectedProductId } = useContext(selectedProductContext)

  const { selectProps: productsSelectProps } = useSelect({
    resource: "products",
    optionLabel: "name",
    optionValue: "id",
  });
  const productsSelectOptions = productsSelectProps?.options || []

  const handleSelect = (productId: any, option: any, rowIndex: number) => {
    setSelectedProductId(productId)
  }



  const renderEditCell = () => {
    switch (dataIndex) {
      case 'product_id':
        return <Select className='w-full' options={productsSelectOptions} onChange={(value, option) => handleSelect(value, option, rowIndex)} />
      case 'include':
        return <Input.TextArea rows={3} />
      case 'unit_price':
        return <InputNumber className='w-full m-0' addonAfter={<p className='w-12 m-0 p-0 text-left'>{`/ ${record?.unit}`}</p>} />
      case 'qty':
        return <InputNumber className='w-full' />
      case 'amount':
        return <div className='text-right'>{`${unit_price * qty}`}</div>
      default:
        return <>{children}</>
    }
  }

  const renderCell = () => {
    switch (dataIndex) {
      case 'product_id':
        return <p className='text-left'>{products.find(product => product.id === record?.product_id)?.name}</p>
      case 'include':
        return record?.include ? <div className='text-xs text-left print:min-w-[18rem]'>{`${record?.include}`}</div> : null
      case 'unit_price':
        return <><div className='inline-block w-1/2 text-right'>{record?.unit_price}</div><div className='inline-block w-1/2 text-left'><span className='mx-1'>/</span>{record?.unit}</div></>
      case 'amount':
        return <div className='text-right'>{record?.amount}</div>
      default:
        return <>{children}</>
    }
  }

  const initialValue = () => {
    return (!dataIndex || !record || !record[dataIndex]) ? '' : record[dataIndex]
  }


  // DEBUG
  // if (dataIndex === 'unit_price') {
  //   console.log('@@@ productsSelectOptions', productsSelectOptions)

  //   console.log('@@@ getFieldsValue', form.getFieldsValue())
  // }

  return (
    <td {...restProps}>
      {isEditing ? (
        <>
          <Form.Item
            name={[dataIndex, rowIndex]}
            style={{ margin: 0 }}
            initialValue={initialValue()}
          >
            {renderEditCell()}
          </Form.Item>
          {/* this is a hidden input */}
          {dataIndex === 'unit_price' && (
            <Form.Item
              name={['unit', rowIndex]}
              style={{ margin: 0 }}
              initialValue={`式`}
              className='hidden'
            >
              <></>
            </Form.Item>
          )}
        </>
      ) : (
        renderCell()
      )}
    </td>
  );
};

export default EditableCell;