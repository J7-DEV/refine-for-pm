import React from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";
import { Create, Form, useForm, Input, Select, useSelect } from "@pankod/refine-antd";
import { Row, Col, InputNumber, Divider, Rate } from 'antd'
import {
  SafetyCertificateOutlined,
  IdcardOutlined,
  UserOutlined,
  ContactsOutlined,
  PhoneOutlined,
  MessageOutlined,
  MailOutlined,
  CarOutlined
} from '@ant-design/icons'
import { ITerm } from "interfaces";
import { types } from 'constants/'

export const CreateView: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm();
  const { selectProps, queryResult: selectQueryResult } = useSelect<ITerm>({
    resource: "terms",
    filters: [
      {
        field: "term_type",
        operator: "eq",
        value: 'out_source',
      },
    ],
  });

  const formattedOptions = selectQueryResult?.data?.data?.map((term) => {
    return {
      label: term.name,
      value: term.id,
    }
  })
  const formattedSelectProps = {
    ...selectProps,
    options: formattedOptions,
  }

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="名稱"
              name={["name"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input addonBefore={<IdcardOutlined />} />
            </Form.Item>
            <Form.Item
              label="統編"
              name={["company_id"]}
            >
              <InputNumber min={10000000} max={99999999} addonBefore={<SafetyCertificateOutlined />} className="w-full" />
            </Form.Item>
            <Form.Item
              label="負責人"
              name={["owner_name"]}
            >
              <Input addonBefore={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="公司電話"
              name={["phone"]}
            >
              <Input addonBefore={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item
              label="地址"
              name={["address"]}
            >
              <Input addonBefore={<CarOutlined />} />
            </Form.Item>

            <Form.Item
              label="類型"
              name={["type"]}
            >
              <Select
                defaultValue=""
                className="w-full"
                options={types}
              />
            </Form.Item>
            <Form.Item
              label="評比"
              name={["rate"]}
            >
              <Rate allowHalf />
            </Form.Item>

          </Col>
          <Col span={16}>
            <Form.Item
              label="備註"
              name={["description"]}
            >
              <Input.TextArea autoSize={{ minRows: 6 }} />
            </Form.Item>
            <Form.Item
              label="Tags"
              name={["tags"]}
            >
              <Select {...formattedSelectProps} mode="multiple"
                allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Divider plain className="mb-16"><IdcardOutlined className="mr-2" />聯絡人資訊</Divider>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="姓名"
              name={["contact_name"]}
            >
              <Input addonBefore={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="職稱"
              name={["contact_jobtitle"]}
            >
              <Input addonBefore={<ContactsOutlined />} />
            </Form.Item>

            <Form.Item
              label="手機"
              name={["contact_phone"]}
            >
              <Input addonBefore={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item
              label="Line"
              name={["contact_line"]}
            >
              <Input addonBefore={<MessageOutlined />} />
            </Form.Item>
            <Form.Item
              label="Email"
              name={["contact_email"]}
            >
              <Input addonBefore={<MailOutlined />} />
            </Form.Item>


          </Col>
          <Col span={16}>
            <Form.Item
              label="聯絡人備註"
              name={["contact_description"]}
            >
              <Input.TextArea autoSize={{ minRows: 6 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
