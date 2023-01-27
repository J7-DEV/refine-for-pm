import { useMany } from "@pankod/refine-core";

import {
  List,
  Table,
  useTable,
  EditButton,
  DeleteButton,
  ShowButton,
} from "@pankod/refine-antd";
import { Rate, Tag, Space } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { ITerm, IClient } from "interfaces";
import { types as typeOptions } from 'constants/'
import { removeDuplicates } from 'utility'

export const ListView: React.FC = () => {
  const { tableProps } = useTable<IClient>({
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
        <Table.Column dataIndex="name" title="名稱" />
        <Table.Column
          dataIndex="rate"
          title="評分"
          defaultSortOrder='descend'
          sorter={(a: IClient, b: IClient) => a.rate - b.rate}
          render={(rate) => <Rate disabled allowHalf defaultValue={rate} />}
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
          width={100}
          dataIndex="type"
          title="分類"
          render={(type) => typeOptions.find((item) => item.value === type)?.label}
          filters={
            typeOptions.map((item) => {
              return {
                text: item.label,
                value: item.value,
              }
            })
          }
          onFilter={(value, record: IClient) => record.type.indexOf(value as string) === 0}
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
                <ShowButton
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


