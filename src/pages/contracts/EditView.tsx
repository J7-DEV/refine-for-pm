import React, { useRef, useState, createContext, useEffect } from "react";
import {
  IResourceComponentsProps, useOne, useGetIdentity
} from "@pankod/refine-core";
import { Edit, Form, useForm, Input, Select, useSelect, DatePicker, DateField, InputNumber } from "@pankod/refine-antd";
import { Typography, Button, Tooltip, Skeleton, Avatar, Divider, Tag } from 'antd'
import {
  PrinterOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { IClient } from "interfaces";
import './style.css'
import ReactToPrint from 'react-to-print';
import dayjs from "dayjs";
import DndTable from "pages/contracts/components/DndTable";
import { contractStatuses } from 'constants/'
import { DataType } from "pages/contracts/components/DndTable/interfaces";

export const TableContext = createContext<any>(null)

export const EditView: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult, onFinish, form } = useForm();
  const watchClient_id = Form.useWatch(['client_id'], form)
  const watchInstallment_1 = Form.useWatch(['installment', 0], form)
  const watchDueDateText = Form.useWatch(['meta', 'dueDateText'], form)
  const watchDeliveryMethod = Form.useWatch(['meta', 'deliveryMethod'], form)
  const watchContractDescription = Form.useWatch(['meta', 'contractDescription'], form)



  const printRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { data: currentUser } = useGetIdentity();

  const contractData = queryResult?.data?.data;
  const productRows = contractData?.products || []
  const initDataSource = productRows.map((productRow: any) => {
    productRow.amount = productRow?.qty * productRow?.unit_price || 0
    return productRow
  })

  const clientId = isEditing ? watchClient_id : (contractData?.client_id || 0);
  console.log('@@@ clientId', clientId)
  const { data: clientData, isLoading: clientIsLoading } = useOne<IClient>({
    resource: "clients",
    id: clientId,
    queryOptions: {
      enabled: !!clientId,
    },
  });
  const client = clientData?.data || null;


  const { data: editedByData, isLoading: editedByIsLoading } = useOne({
    resource: "profiles",
    id: contractData?.edited_by,
    queryOptions: {
      enabled: !!contractData?.edited_by,
    },
  });
  const editedByUser = editedByData?.data || null;


  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [isTax, setIsTax] = useState(true)

  const sumAmount = (dataSource.length) ? dataSource.reduce((acc: number, cur: DataType) => acc + (cur?.qty || 1) * (cur?.unit_price || 0), 0) : 0
  const tax = isTax ? Math.round(sumAmount * 0.05) : 0
  const total_price = sumAmount + tax

  const installment_1 = isEditing ? watchInstallment_1 : ((contractData?.installment instanceof Array) ?
    contractData?.installment[0] : total_price * 0.5)
  const installment_2 = installment_1 ? total_price - installment_1 : total_price * 0.5

  const dueDateText = isEditing ? watchDueDateText : contractData?.meta?.dueDateText
  const deliveryMethod = isEditing ? watchDeliveryMethod : contractData?.meta?.deliveryMethod
  const contractDescription = isEditing ? watchContractDescription : contractData?.meta?.contractDescription



  useEffect(() => {
    if (contractData) {
      setDataSource(initDataSource)
      setIsTax(contractData?.tax ?? true)
    }
  }, [contractData?.products, contractData?.tax])

  const tableUtility = {
    dataSource,
    setDataSource,
    isEditing,
    isTax,
    setIsTax,
    sumAmount,
    tax,
    total_price,
  }


  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  /**
   * BUG: dataSource取消時會亂掉
   */
  const handleCancel = () => {
    setIsEditing(false)
    setDataSource(initDataSource)
    setIsTax(contractData?.tax || true)
  }

  /**
   * Select
   */
  const { selectProps: clientsSelectProps } = useSelect({
    resource: "clients",
    optionLabel: "name",
    optionValue: "id",
  });

  const handleOnFinish = (values: any) => {
    console.log('@@@@@', values)
    const product_ids = values?.product_id || []
    const includes = values?.include || []
    const unit_price = values?.unit_price || []
    const qty = values?.qty || []
    const unit = values?.unit || []
    const amount = values?.amount || []

    onFinish({
      name: values?.name || '',
      status: values?.status || '',
      client_id: values?.client_id || null,
      total_price: total_price || 0,
      tax: isTax,
      edited_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      edited_by: currentUser?.id,
      version: contractData?.version + 0.1 || 1,
      sent_at: values?.sent_at || null,
      pm_id: values?.pm_id || null, // TODO
      installment: [installment_1, installment_2],
      meta: {
        dueDateText: dueDateText || '',
        deliveryMethod: deliveryMethod || '',
        contractDescription: contractDescription || '',
      },
      products: product_ids.map((id: number, index: number) => (
        {
          key: index,
          product_id: parseInt(id.toString(), 10),
          include: includes[index],
          unit_price: parseInt(unit_price[index], 10),
          qty: parseInt(qty[index], 10),
          unit: unit[index],
          amount: parseInt(amount[index], 10),
        })),
    });
  }

  const statusOptions = contractStatuses.map((status) => ({
    label: status.label,
    value: status.value,
  }));

  /**
   * get company data
   * TODO : useApiUrl error change useOne to useCustom
   */



  const { data: companyData, isLoading: companyIsLoading } = useOne({
    resource: "options",
    id: 1,
  })
  const company = companyData?.data?.meta_value || null;


  return (
    <Edit
      saveButtonProps={{
        ...saveButtonProps,
      }}
      footerButtons={({ defaultButtons }) => (
        <>
          {isEditing ? (
            <>
              {defaultButtons}
              <Button className="mr-2" type='primary' danger icon={<CloseOutlined />} onClick={handleCancel} >Cancel</Button>
            </>
          ) : (
            <Button className="mr-2" type='primary' icon={<EditOutlined />} onClick={handleEdit}>Edit</Button>
          )
          }
          <ReactToPrint
            trigger={() => <Button disabled={isEditing} type='primary' icon={<PrinterOutlined />}>Print</Button>}
            content={() => printRef.current}
          />


        </>
      )}
    >

      <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>

        <div className="table table_td-flex-1 w-full">
          <div className="tr">
            <div className="th">合約狀態</div>
            <div className="td">
              {isEditing ? (<>
                <Form.Item
                  className="mb-0"
                  name={["status"]}
                >
                  <Select options={statusOptions} />
                </Form.Item>
              </>) : (
                <>
                  {!!contractData?.status && (<Tag color={contractStatuses?.find((status) => status.value === contractData?.status)?.color || 'default'}>
                    {contractStatuses?.find((status) => status.value === contractData?.status)?.label}
                  </Tag>)}
                </>
              )}</div>
            <div className="th">上次修改</div>
            <div className="td">
              {!!contractData?.edited_at && (
                <>
                  {dayjs(contractData?.edited_at).format('YYYY-MM-DD HH:mm:ss')}
                  <Tooltip title={editedByUser?.full_name}>
                    <Avatar icon={<UserOutlined />} className="ml-2" src={editedByUser?.avatar_url} alt={editedByUser?.full_name} size='small' />
                  </Tooltip>
                </>
              )}
            </div>
          </div>

        </div>

        <Divider plain className="my-24">報價單預覽</Divider>


        <div className="print w-full" ref={printRef}>
          <div className="table table-head table_td-flex-1 w-full">
            <div className="text-center font-bold mb-8 print:mb-16 print:mt-8">
              <h1 className="text-xl">報價單</h1>
            </div>
            <div className="tr">
              <div className="th">報價編號</div>
              <div className="td">{contractData?.id?.toString().padStart(5, '0')}</div>
              <div className="th">報價日期</div>
              <div className="td">
                {isEditing ? (
                  <Form.Item
                    className="mb-0"
                    name={["sent_at"]}
                    getValueProps={(value) => ({
                      value: value ? dayjs(value) : undefined,
                    })}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                ) : (
                  <DateField value={contractData?.sent_at} format="YYYY-MM-DD" />
                )}
              </div>
            </div>
            <div className="tr">
              <div className="th">專案名稱</div>
              <div className="td">
                {isEditing ? (
                  <Form.Item
                    className="mb-0"
                    name={["name"]}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                ) : (
                  <>{`${contractData?.name}`} <Typography.Text code>v{contractData?.version.toFixed(1)}</Typography.Text></>
                )}
              </div>
              <div className="th">
                <Tooltip title='預設為 15 天'>報價有效期限</Tooltip>
              </div>
              <div className="td">
                {!!contractData?.sent_at &&
                  <Tooltip title='預設為 15 天'>
                    {dayjs(contractData?.sent_at).add(15, 'day').format('YYYY-MM-DD')}
                  </Tooltip>
                }
              </div>
            </div>
            <div className="tr">
              <div className="th">客戶聯絡人</div>
              <div className="td">

                {
                  (clientIsLoading) ? (
                    <>
                      <Skeleton.Input active className="w-full" size="default" />
                      <Skeleton.Input active className="w-full" size="default" />
                      <Skeleton.Input active className="w-full" size="default" />
                    </>
                  ) : (
                    <>
                      <p><UserOutlined className="mr-2" />{client?.contact_name}</p>
                      <p><PhoneOutlined className="mr-2" />{client?.contact_phone}</p>
                      <p><MailOutlined className="mr-2" />{client?.contact_email}</p>
                    </>
                  )
                }
              </div>
              <div className="th">專案聯絡人</div>
              <div className="td">
                <p><UserOutlined className="mr-2" />劉哲宇</p>
                <p><PhoneOutlined className="mr-2" />0921-565-659</p>
                <p><MailOutlined className="mr-2" />frencyliu@gmail.com</p>
              </div>
            </div>
          </div>


          {/* <div className="tr">
              <div className="th">#</div>
              <div className="th">名稱</div>
              <div className="th">備註</div>
              <div className="th">單價<span className="mx-2">/</span></div>
              <div className="th">單位</div>
              <div className="th">數量</div>
              <div className="th">小計</div>
            </div>
            <div className="tr">
              <div className="td">
                {isEditing && <DeleteOutlined className="mr-2 text-red-500" />}
                1</div>
              <div className="td">WPML多語系</div>
              <div className="td">歐元、美金、台幣未來
                可自行擴充</div>
              <div className="td">10,000<span className="mx-2">/</span></div>
              <div className="td">式</div>
              <div className="td">1</div>
              <div className="td">10,000</div>
            </div>
            <div className="tr">
              <div className="td">
                {isEditing && <DeleteOutlined className="mr-2 text-red-500" />}
                2</div>
              <div className="td">伺服器 - 一般型</div>
              <div className="td">
                商城用主機<br />
                1. SSD硬碟<br />
                2. SSL憑證<br />
                3. 定期備份<br />
                4. 伺服器軟體定期更新 5. 全球CDN發佈網路 6. 高階防火牆WAF</div>
              <div className="td">10,000<span className="mx-2">/</span></div>
              <div className="td">式</div>
              <div className="td">1</div>
              <div className="td">10,000</div>
            </div> */}
          <div className="table table-main mt-8 print:mt-16 w-full">

            <TableContext.Provider value={tableUtility}>
              <DndTable />
            </TableContext.Provider>
          </div>





          <div className="table table-meta table_td-flex-1 mt-8 print:mt-16 w-full">
            <div className="tr">
              <div className="w-1/2 py-1 text-center font-bold bg-teal-600 text-white">付款條件</div>
              <div className="w-1/2 py-1 text-center font-bold bg-cyan-600 text-white">備註</div>
            </div>
            <div className="tr">
              <div className="th">訂金</div>
              <div className="td">
                {isEditing ? (
                  <Form.Item
                    name={['installment', 0]}
                    className="mb-0"
                  >
                    <InputNumber />
                  </Form.Item>) : (
                  <>{installment_1}</>
                )}

              </div>
              <div className="th">工期</div>
              <div className="td">
                {isEditing ? (
                  <Form.Item
                    name={['meta', 'dueDateText']}
                    className="mb-0"
                  >
                    <Input />
                  </Form.Item>) : (
                  <>{dueDateText}</>
                )}
              </div>
            </div>
            <div className="tr">
              <div className="th">尾款</div>

              <div className="td">{installment_2}
              </div>
              <div className="th">交付方式</div>
              <div className="td">
                {isEditing ? (
                  <Form.Item
                    name={['meta', 'deliveryMethod']}
                    className="mb-0"
                  >
                    <Input />
                  </Form.Item>) : (
                  <>{deliveryMethod}</>
                )}
              </div>
            </div>
            <div className="tr">
              <div className="th">付款帳號</div>
              <div className="td">
                {company?.account}
              </div>
              <div className="th">備註</div>
              <div className="td">
                {isEditing ? (
                  <Form.Item
                    name={['meta', 'contractDescription']}
                    className="mb-0"
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>) : (
                  <>{contractDescription}</>
                )}
              </div>
            </div>
          </div>

          <div className="table table-contact table_td-flex-1 mt-8 print:mt-16 w-full">
            <div className="tr">
              <div className="w-1/2 py-1 text-center font-bold bg-teal-600 text-white">甲方</div>
              <div className="w-1/2 py-1 text-center font-bold bg-cyan-600 text-white">乙方</div>
            </div>
            <div className="tr">
              <div className="th">公司名稱</div>
              <div className="td">
                {
                  isEditing ? (
                    <Form.Item
                      className="mb-0"
                      name={["client_id"]}
                    >
                      <Select
                        options={clientsSelectProps?.options || []}
                      />
                    </Form.Item>

                  ) : (
                    <>
                      {
                        (clientIsLoading) ? (
                          <Skeleton.Input active className="w-full" size="default" />
                        ) : (
                          <>{client?.name}</>
                        )
                      }
                    </>
                  )
                }

              </div>
              <div className="th">公司名稱</div>
              <div className="td">{company?.name}</div>
            </div>
            <div className="tr">
              <div className="th">統一編號</div>
              <div className="td">
                {
                  (clientIsLoading) ? (
                    <Skeleton.Input active className="w-full" size="default" />
                  ) : (
                    <>{client?.company_id}</>
                  )
                }
              </div>
              <div className="th">統一編號</div>
              <div className="td">{company?.company_id}</div>
            </div>
            <div className="tr">
              <div className="th">負責人</div>
              <div className="td">
                {(clientIsLoading) ? (
                  <Skeleton.Input active className="w-full" size="default" />
                ) : (
                  <>{client?.owner_name}</>
                )}

              </div>
              <div className="th">負責人</div>
              <div className="td">{company?.owner_name}</div>
            </div>

            <div className="tr">
              <div className="th">地址</div>
              <div className="td">
                {
                  (clientIsLoading) ? (
                    <Skeleton.Input active className="w-full" size="default" />
                  ) : (
                    <>{client?.address}</>
                  )
                }
              </div>
              <div className="th">地址</div>
              <div className="td">{company?.address}</div>
            </div>
            <div className="tr">
              <div className="th">電話</div>
              <div className="td">
                {
                  (clientIsLoading) ? (
                    <Skeleton.Input active className="w-full" size="default" />
                  ) : (
                    <>{client?.phone}</>
                  )
                }
              </div>
              <div className="th">電話</div>
              <div className="td">{company?.phone}</div>
            </div>
          </div>

        </div>
      </Form>
    </Edit >
  );
};
