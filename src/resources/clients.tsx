import React from 'react'
import { ListView, CreateView, ShowView, EditView } from "pages/clients";
import {
  SketchOutlined,
} from "@ant-design/icons"

export const clients = {
  name: "clients",
  list: ListView,
  edit: EditView,
  show: ShowView,
  create: CreateView,
  icon: <SketchOutlined />,
  options: { label: "Clients" },
  canDelete: true,
}