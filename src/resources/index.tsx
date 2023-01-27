import React from 'react'
import { AntdInferencer } from "@pankod/refine-inferencer/antd";
import {
  ReadOutlined,
  TeamOutlined,
  SlidersOutlined,
  ProjectOutlined,
} from "@ant-design/icons"
import { outSources } from './out-sources'
import { clients } from './clients'
import { products } from './products'
import { contracts } from './contracts'





const resources = [
  {
    name: "projects",
    list: AntdInferencer,
    edit: AntdInferencer,
    show: AntdInferencer,
    create: AntdInferencer,
    icon: <ProjectOutlined />,
    options: { label: "Projects" },
    canDelete: true,
  },
  outSources,
  clients,
  contracts,
  products,
  {
    name: "posts",
    list: AntdInferencer,
    edit: AntdInferencer,
    show: AntdInferencer,
    create: AntdInferencer,
    icon: <ReadOutlined />,
    options: { label: "Knowledge" },
    canDelete: true,
  },
  {
    name: "profiles",
    list: AntdInferencer,
    edit: AntdInferencer,
    show: AntdInferencer,
    create: AntdInferencer,
    icon: <TeamOutlined />,
    options: { label: "Users" },
    canDelete: true,
  },
  {
    name: "settings",
    icon: <SlidersOutlined />,
    options: { label: "Settings" },
  },
  {
    name: "options",
    list: AntdInferencer,
    edit: AntdInferencer,
    show: AntdInferencer,
    create: AntdInferencer,
    parentName: 'settings',
    options: { label: "Options" },
    canDelete: true,
  },
  {
    name: "terms",
    list: AntdInferencer,
    edit: AntdInferencer,
    show: AntdInferencer,
    create: AntdInferencer,
    parentName: 'settings',
    options: { label: "Terms" },
    canDelete: true,
  },
];

export default resources;
