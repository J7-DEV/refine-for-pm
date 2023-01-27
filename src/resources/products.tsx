import React from 'react'
import { ListView, CreateView, EditView } from "pages/products";
import {
  StarOutlined,
} from "@ant-design/icons"

export const products = {
  name: "products",
  list: ListView,
  edit: EditView,
  show: EditView,
  create: CreateView,
  icon: <StarOutlined />,
  options: { label: "Products" },
  canDelete: true,
}