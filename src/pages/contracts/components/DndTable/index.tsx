import React, { useCallback, useContext } from 'react';
import { useMany } from '@pankod/refine-core'
import { Table, Button, Switch } from 'antd';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './style.css'
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { DataType } from './interfaces'
import { nanoid } from 'nanoid';
import DraggableBodyRow from './components/DraggableBodyRow'
import EditableCell from './components/EditableCell'
import { TableContext } from 'pages/contracts/EditView'

const DndTable: React.FC = () => {
  const { dataSource, setDataSource, isEditing, isTax, setIsTax, sumAmount, tax, total_price } = useContext(TableContext);
  const { data: productsData } = useMany({
    resource: "products",
    ids: dataSource.map((item: DataType) => item?.product_id || 0),
    queryOptions: {
      enabled: !!dataSource.length,
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 5,
    },
  })

  const products = productsData?.data || []

  const components = {
    body: {
      row: DraggableBodyRow,
      cell: EditableCell,
    },
  };

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = dataSource[dragIndex];
      console.log('@@@ moveRow', {
        dragIndex,
        hoverIndex,
        dragRow,
        update: update(dataSource, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      })
      setDataSource(
        update(dataSource, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [dataSource],
  );

  const handleAdd = () => {
    const newData: DataType = {
      key: nanoid(),
      product_id: '',
      include: '',
      unit_price: 0,
      unit: '',
      qty: 1,
      amount: 0,
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item: DataType) => item.key !== key);
    setDataSource(newData);
  };

  const handleTax = (checked: boolean) => {
    setIsTax(checked)
  };



  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Table
          dataSource={dataSource}
          components={components}
          pagination={false}
          onRow={(_, rowIndex) => {
            const attr = {
              rowIndex,
              moveRow,
              setDataSource,
              isEditing,
            };
            return attr as React.HTMLAttributes<any>;
          }}
        >
          <Table.Column
            width={75}
            key="key"
            dataIndex="key"
            title={<span className='font-light text-[#555]'>#</span>}
            align='center'
            className='px-2 print:text-[12px]'
            render={(key, _record, index) => <>
              {isEditing && <CloseCircleOutlined className='mr-2 text-red-500' onClick={() => handleDelete(key)} />}
              {index + 1}
            </>}
          />
          <Table.Column
            width={200}
            key="product_id"
            dataIndex="product_id"
            title={<span className='font-light text-[#555]'>名稱</span>}
            align='center'
            className='px-2 print:text-[12px]'
            onCell={(record: DataType, rowIndex: number | undefined): any => ({
              isEditing,
              record,
              rowIndex,
              dataIndex: 'product_id',
              products,
            })}
          />
          <Table.Column
            key="include"
            dataIndex="include"
            title={<span className='font-light text-[#555]'>備註</span>}
            align='center'
            className='px-2 print:text-[12px]'
            onCell={(record: DataType, rowIndex: number | undefined): any => ({
              isEditing,
              record,
              rowIndex,
              dataIndex: 'include',
            })}
          />
          <Table.Column
            width={210}
            key="unit_price"
            dataIndex="unit_price"
            title={<span className='font-light text-[#555]'>單價</span>}
            align='center'
            className='px-2 print:text-[12px]'
            onCell={(record: DataType, rowIndex: number | undefined): any => ({
              isEditing,
              record,
              rowIndex,
              dataIndex: 'unit_price',
            })}
          />
          <Table.Column
            width={128}
            key="qty"
            dataIndex="qty"
            title={<span className='font-light text-[#555]'>數量</span>}
            align='center'
            className='px-2 print:text-[12px]'
            onCell={(record: DataType, rowIndex: number | undefined): any => ({
              isEditing,
              record,
              rowIndex,
              dataIndex: 'qty',
            })}

          />
          <Table.Column
            width={96}
            key="amount"
            dataIndex="amount"
            title={<span className='font-light text-[#555]'>小計</span>}
            align='center'
            className='px-2 print:text-[12px]'
            onCell={(record: DataType, rowIndex: number | undefined): any => ({
              isEditing,
              record,
              rowIndex,
              dataIndex: 'amount',
            })}
          />


        </Table>
      </DndProvider>
      {isEditing && <Button type="dashed" size='large' className="my-2 w-full print:hidden" onClick={handleAdd}><PlusCircleOutlined className="mr-2" />新增一筆資料</Button>}
      <div className="tfoot">
        <div className="tr">
          <div className="td"></div>
          <div className="td"></div>
          <div className="td"></div>
          <div className="td"></div>

          <div className="th py-4">小計</div>
          <div className="td py-4">{sumAmount}</div>
        </div>
        {(isTax || isEditing) && (
          <div className="tr">
            <div className="td"></div>
            <div className="td"></div>
            <div className="td"></div>
            <div className="td"></div>
            <div className={`th py-4 flex justify-between ${isTax ? '' : 'border-dashed border-r-0 border-4 border-gray-400 bg-yellow-50 z-10'}`}>
              <div className="inline-block">
                {isEditing && (
                  <Switch size='small' defaultChecked={isTax} onChange={handleTax} />
                )}
              </div>
              <div className="inline-block m-0">稅率({isTax ? '5%' : '0%'})</div>
            </div>
            <div className={`td py-4 ${isTax ? '' : 'border-dashed border-l-0 border-4 border-gray-400 bg-yellow-50 z-10'}`}>{tax}</div>
          </div>
        )}

        <div className="tr">
          <div className="td"></div>
          <div className="td"></div>
          <div className="td"></div>
          <div className="td"></div>
          <div className="th py-4">總價</div>
          <div className="td py-4">
            {total_price}
          </div>
        </div>
      </div>

    </>
  );
};

export default DndTable;