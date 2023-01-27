import { useMany } from "@pankod/refine-core";

import {
  List,
  Table,
  useTable,
  EditButton,
  DateField,
} from "@pankod/refine-antd";
import { Tag, Space, Typography, Button } from 'antd'
import { LoadingOutlined, CalendarOutlined, UserOutlined, PrinterOutlined } from '@ant-design/icons'
import { IContracts, IClient, IMapping } from "interfaces";
import { removeDuplicates, supabaseClient } from 'utility'
import { contractStatuses } from 'constants/'

export const ListView: React.FC = () => {
  const { tableProps } = useTable<IContracts>({
    syncWithLocation: true,
  });

  const clientIds = (tableProps?.dataSource?.map((data) => data.client_id || []).flat()) ?? [];
  const rmDupClientIds = removeDuplicates(clientIds);

  const { data: clientData, isLoading: clientIsLoading } = useMany<IClient>({
    resource: "clients",
    ids: rmDupClientIds,
    queryOptions: {
      enabled: rmDupClientIds.length > 0,
    },
  });
  const clients = clientData?.data || [];


  return (
    <List createButtonProps={{ type: "primary" }}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          width={100}
          dataIndex="id"
          title="合約編號"
          render={(id) => <Typography.Text code>{id.toString().padStart(5, '0')}</Typography.Text>}
        />
        <Table.Column
          width={240}
          dataIndex="name"
          title="名稱"
          render={(name, record: IContracts) => <>{name} <Typography.Text code>v{record.version.toFixed(1)}</Typography.Text></>}
        />
        <Table.Column
          width={240}
          dataIndex="status"
          title="狀態"
          render={(status) => {
            const statusObj = contractStatuses.find((item: IMapping) => item.value === status)
            return <Tag color={statusObj?.color}>{statusObj?.label}</Tag>
          }
          }
        />
        <Table.Column
          width={240}
          dataIndex="client_id"
          title="客戶"
          render={(client_id) => {
            if (!client_id) return <></>

            if (clientIsLoading) {
              return <LoadingOutlined />;
            }
            return (
              clients.map((item) => {
                if (item.id === client_id) {
                  return item.name
                }
              })
            );
          }}
        />

        <Table.Column
          width={150}
          dataIndex="total_price"
          title="總價"
          render={(totalPrice) => totalPrice}
          sorter={(a: IContracts, b: IContracts) => a.total_price - b.total_price}
        />
        <Table.Column
          width={150}
          dataIndex="edited_at"
          title="修改日期"
          render={(edited_at, record: IContracts) => {
            // const getUser = async () => {
            //   const { data, error } = await supabaseClient.auth.admin.getUserById(record?.edited_by)
            //   console.log(data)
            // }
            // console.log(record)
            return (edited_at) ? (
              <>
                <p className="whitespace-nowrap mb-0">
                  <CalendarOutlined className="mr-2 text-xs" />
                  <DateField value={edited_at} format='YYYY/MM/DD' className="text-xs" />
                </p>
                <p className="whitespace-nowrap mb-0">
                  <UserOutlined className="mr-2 text-xs" />
                  <Typography.Text italic className="text-xs">by 劉哲宇</Typography.Text>
                  {/* TODO get user name */}
                </p>
              </>
            ) : (
              <></>
            )
          }}
        />
        <Table.Column
          width={120}
          dataIndex='id'
          title=''
          render={(id) => {

            return (<>
              <Space>
                <EditButton
                  type="primary"
                  hideText
                  shape='circle'
                  size="small"
                  recordItemId={id}
                />
                <Button size="small" disabled type="primary" shape="circle" icon={<PrinterOutlined />} />
              </Space>
            </>);
          }}
        />
      </Table>
    </List>
  );
};


