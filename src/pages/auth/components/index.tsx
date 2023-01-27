import React from "react";
import { LoginPageProps, LoginFormTypes } from "@pankod/refine-core";
import {
  Row,
  Col,
  Layout,
  Card,
  Button,
  CardProps,
  LayoutProps,
  FormProps,
} from "antd";
import { useLogin } from "@pankod/refine-core";
import { GoogleOutlined } from '@ant-design/icons';


type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;

/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
}) => {
  const { mutate: login } = useLogin<LoginFormTypes>();



  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                size="large"
                key={provider.name}
                type="primary"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "0px",
                }}
                onClick={() =>
                  login({
                    providerName: provider.name,
                  })
                }
              >
                <GoogleOutlined className="mr-2" />
                {provider.label}
              </Button>
            );
          })}
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card
      className="bg-white/80 py-2 rounded-2xl shadow-2xl text-center"
      {...(contentProps ?? {})}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
      {renderProviders()}
    </Card>
  );

  return (
    <Layout  {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col className="max-w-sm" xs={20}>
          {renderContent ? renderContent(CardContent) : CardContent}
        </Col>
      </Row>
    </Layout>
  );
};
