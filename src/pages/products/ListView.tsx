import { useMany } from "@pankod/refine-core";

import {
  List,
  Table,
  useTable,
  EditButton,
  DeleteButton,
} from "@pankod/refine-antd";
import { Tag, Space, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { ITerm, IProduct } from "interfaces";
import { removeDuplicates } from 'utility'

export const ListView: React.FC = () => {
  const { tableProps } = useTable<IProduct>({
    syncWithLocation: true,
  });

  const termIds = (tableProps?.dataSource?.map((data) => data.tags || []).flat()) ?? [];
  const rmDupTermIds = removeDuplicates(termIds);

  const { data: termData, isLoading } = useMany<ITerm>({
    resource: "terms",
    ids: rmDupTermIds,
    queryOptions: {
      enabled: rmDupTermIds.length > 0,
    },
  });
  const tags = termData?.data || [];

  return (
    <List createButtonProps={{ type: "primary" }}>
      <Table {...tableProps} rowKey="id">
        <Table.Column width={240} dataIndex="name" title="名稱" />
        <Table.Column
          width={400}
          dataIndex="description"
          title="備註"
          render={(description, record: IProduct) => <Typography.Paragraph type='secondary' className="text-xs" ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
            {description}
            {!!record?.include && (
              <>
                <br /><br />
                <p className="text-sky-600 mb-0">包含範圍:</p>
                {record?.include}
              </>
            )}
            {!!record?.exclude && (
              <>
                <br /><br />
                <p className="text-pink-600 mb-0">不包含範圍:</p>
                {record?.exclude}
              </>
            )}
          </Typography.Paragraph>}
        />
        <Table.Column
          dataIndex='tags'
          title="Tags"
          render={(tag_ids) => {
            if (!tag_ids) return <></>
            if (Array.isArray(tag_ids) && tag_ids.length === 0) return <></>

            if (isLoading) {
              return <LoadingOutlined />;
            }
            return (
              tag_ids.map((id: number) => {
                const tagSlug = tags.find((item) => item.id === id)?.slug
                const tagName = tags.find((item) => item.id === id)?.name
                return <Tag key={tagSlug} color="magenta">{tagName}</Tag>
              })
            );
          }}
        />
        <Table.Column
          width={150}
          dataIndex="unit_price"
          title="單價"
          render={(unitPrice, record) => `${unitPrice} / ${record?.unit}`}
          sorter={(a: IProduct, b: IProduct) => a.unit_price - b.unit_price}
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
                <DeleteButton
                  type="primary"
                  danger
                  hideText
                  shape='circle'
                  size="small"
                  recordItemId={id}
                />
              </Space>
            </>);
          }}
        />
      </Table>
    </List>
  );
};


