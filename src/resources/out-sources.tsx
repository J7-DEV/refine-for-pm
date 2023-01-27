import React from 'react'
import { ListView, CreateView, ShowView, EditView } from "pages/out-sources";
import {
  MoneyCollectOutlined,
} from "@ant-design/icons"

export const outSources = {
  name: "out_sources",
  list: ListView,
  edit: EditView,
  show: ShowView,
  create: CreateView,
  icon: <MoneyCollectOutlined />,
  options: { label: "Out Sources" },
  canDelete: true,
}