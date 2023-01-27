import React from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";
import { Edit, Form, useForm, Input, Select, useSelect } from "@pankod/refine-antd";
import { Row, Col, InputNumber, Typography } from 'antd'
import {
  AccountBookOutlined,
  DollarCircleOutlined,
  InboxOutlined
} from '@ant-design/icons'
import { ITerm } from "interfaces";

export const EditView: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  const clientsData = queryResult?.data?.data;

  const { selectProps, queryResult: selectQueryResult } = useSelect<ITerm>({
    resource: "terms",
    filters: [
      {
        field: "term_type",
        operator: "eq",
        value: 'product',
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
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={8} className="pt-8">
            <div className="bg-red-50 pt-2 pb-8 px-4 rounded-lg h-full relative">
              <Typography.Text type="danger"><p className="bg-red-50 rounded-lg inline-block absolute -top-8 left-0 px-2 pt-1 pb-4">此區域會出現在報價單上</p></Typography.Text>
              <Form.Item
                label="名稱"
                name={["name"]}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input className="bg-white" addonBefore={<AccountBookOutlined />} />
              </Form.Item>
              <Form.Item
                label="建議單價"
                name={["unit_price"]}
              >
                <InputNumber addonBefore={<DollarCircleOutlined />} className="w-full bg-white" />
              </Form.Item>
              <Form.Item
                label="單位"
                name={["unit"]}
              >
                <Input className="bg-white" addonBefore={<InboxOutlined />} defaultValue='式' />
              </Form.Item>
              <Form.Item
                label="包含範圍"
                name={["include"]}
              >
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </Form.Item>
              <Form.Item
                label="不包含範圍"
                name={["exclude"]}
              >
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </Form.Item>
            </div>
          </Col>
          <Col span={16} className="pt-8">
            <div className="bg-gray-50 pt-2 pb-8 px-4 rounded-lg h-full relative">
              <Typography.Text><p className="bg-gray-50 rounded-lg inline-block absolute -top-8 left-0 px-2 pt-1 pb-4">此區域不會出現在報價單上</p></Typography.Text>
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
            </div>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
};
