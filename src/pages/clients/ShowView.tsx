import React from "react";
import { useShow, useMany } from "@pankod/refine-core";
import {
  Show,
  Input,
  Select,
} from "@pankod/refine-antd";
import { Row, Col, Rate, Divider, Tag, Skeleton } from 'antd'
import { IdcardOutlined, SafetyCertificateOutlined, UserOutlined, ContactsOutlined, PhoneOutlined, MessageOutlined, MailOutlined, CarOutlined } from '@ant-design/icons'
import { types } from 'constants/'
import { ITerm } from "interfaces";



export const ShowView: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const tag_ids = record?.tags || [];

  const { data: termData, isLoading: termIsLoading } = useMany<ITerm>({
    resource: "terms",
    ids: tag_ids,
    queryOptions: {
      enabled: tag_ids.length > 0,
    },
  });
  const tags = termData?.data || [];

  return (
    <Show title='回列表'>
      <Row gutter={24}>
        <Col span={8}>
          <div className="mb-6">
            <p className="mb-2">名稱</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<IdcardOutlined />} value={record?.name} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">統編</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<SafetyCertificateOutlined />} value={record?.company_id} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">負責人</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<UserOutlined />} value={record?.owner_name} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">公司電話</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<PhoneOutlined />} value={record?.phone} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">地址</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<CarOutlined />} value={record?.address} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">類型</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Select
                  value={types.find((type) => type.value === record?.type)?.label}
                  className="w-full"
                  open={false}
                />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">評比</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Rate value={record?.rate} allowHalf disabled />
              )
            }
          </div>


        </Col>
        <Col span={16}>
          <div className="mb-6">
            <p className="mb-2">備註</p>
            {
              <Skeleton active className="w-full" loading={isLoading}>
                <Input.TextArea autoSize={{ minRows: 6 }} value={record?.description} />
              </Skeleton>
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">Tags</p>
            {
              tags.map((tag) => {
                if (termIsLoading) {
                  return <Skeleton.Input active className="w-full" size="default" />;
                }
                return (
                  <Tag color={tag?.color || 'magenta'}>{tag.name}</Tag>
                )
              })
            }
          </div>
        </Col>
      </Row>

      <Divider plain className="mb-16"><IdcardOutlined className="mr-2" />聯絡人資訊</Divider>
      <Row gutter={24}>
        <Col span={8}>
          <div className="mb-6">
            <p className="mb-2">姓名</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<UserOutlined />} value={record?.contact_name} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">職稱</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<ContactsOutlined />} value={record?.contact_jobtitle} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">手機</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<PhoneOutlined />} value={record?.contact_phone} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">Line</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<MessageOutlined />} value={record?.contact_line} />
              )
            }
          </div>
          <div className="mb-6">
            <p className="mb-2">Email</p>
            {
              isLoading ? (
                <Skeleton.Input active className="w-full" size="default" />
              ) : (
                <Input addonBefore={<MailOutlined />} value={record?.contact_email} />
              )
            }

          </div>
        </Col>
        <Col span={16}>
          <div className="mb-6">
            <p className="mb-2">聯絡人備註</p>
            {
              <Skeleton active className="w-full" loading={isLoading}>
                <Input.TextArea autoSize={{ minRows: 6 }} value={record?.contact_description} />
              </Skeleton>
            }
          </div>
        </Col>
      </Row>
    </Show>
  );
};