import { useContext } from "react";
import {
  useGetIdentity,
} from "@pankod/refine-core";
import {
  AntdLayout,
  Space,
  Avatar,
  Typography,
  Switch,
} from "@pankod/refine-antd";
import { ColorModeContext } from "contexts";

const { Text } = Typography;

export const Header: React.FC = () => {
  const { data: user } = useGetIdentity();
  const { mode, setMode } = useContext(ColorModeContext);

  return (
    <AntdLayout.Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
      }}
      className="print:hidden"
    >
      <Switch
        checkedChildren="🌛"
        unCheckedChildren="🔆"
        onChange={() => setMode(mode === "light" ? "dark" : "light")}
        defaultChecked={mode === "dark"}
      />
      <Space style={{ marginLeft: "8px" }}>
        {user?.user_metadata?.avatar_url && <Avatar src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />}
      </Space>
    </AntdLayout.Header>
  );
};

