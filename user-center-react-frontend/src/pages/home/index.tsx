import { PageContainer } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import React from "react";

import "./home.css";

const Home: React.FC = () => {
  const { initialState } = useModel("@@initialState");
  const isDark = initialState?.settings?.navTheme === "realDark";

  return (
    <PageContainer
      title={
        <>
          Welcome to Ant Design Pro
          <span className="welcome-gradient-title">V6</span>🎉
        </>
      }
    >
      <div
        data-theme={isDark ? "dark" : "light"}
        className="flex flex-col gap-6 md:flex-row"
      >
        <div className="min-w-0 md:flex-2">欢迎页面</div>
      </div>
    </PageContainer>
  );
};

export default Home;
