import React from 'react'
import { ListView, CreateView, EditView } from "pages/contracts";
import {
  AuditOutlined,
} from "@ant-design/icons"

export const contracts = {
  name: "contracts",
  list: ListView,
  edit: EditView,
  show: EditView,
  create: CreateView,
  icon: <AuditOutlined />,
  options: { label: "Quotations" },
  canDelete: false,
}