import React from "react";

import { Refine } from "@pankod/refine-core";
import {
  notificationProvider,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-antd";
import "@pankod/refine-antd/dist/reset.css";


import { dataProvider, liveProvider } from "@pankod/refine-supabase";
import resources from "resources/";
import routerProvider from "@pankod/refine-react-router-v6";
import { RefineKbarProvider } from "@pankod/refine-kbar";
import { supabaseClient } from "utility";
import { ColorModeContextProvider } from "contexts";
import {
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from "components/layout";
import authProvider from "authProvider";
import { AuthPage } from "pages/auth";
import 'App.css'


function App() {
  return (
    <ColorModeContextProvider>
      <RefineKbarProvider>

        <Refine
          dataProvider={{
            default: dataProvider(supabaseClient)
          }
          }
          liveProvider={liveProvider(supabaseClient)}
          authProvider={authProvider}
          routerProvider={{
            ...routerProvider,
          }}
          LoginPage={() => (
            <AuthPage
              type="login"
              providers={[
                {
                  name: "google",
                  label: "Sign in with Google",
                },
              ]}

              wrapperProps={{
                style: {
                  backgroundImage: "url(https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80)",
                  backgroundSize: "cover",
                  minHeight: "100vh",
                },
              }}

            />
          )}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          resources={resources}
          Title={Title}
          Header={Header}
          Sider={Sider}
          Footer={Footer}
          Layout={Layout}
          OffLayoutArea={OffLayoutArea}
        />
      </RefineKbarProvider>
    </ColorModeContextProvider>
  );
}

export default App;
