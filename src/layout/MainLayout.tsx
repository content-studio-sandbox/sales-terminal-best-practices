import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Content } from "@carbon/react";
import AppHeader from "@/layout/AppHeader";
import AppFooter from "@/layout/AppFooter";

const MainLayout = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <AppHeader onFeedbackClick={() => setShowFeedback(true)} />

      <Content style={{ flex: 1 }}>
        <Outlet />
      </Content>

      <AppFooter onFeedbackClick={() => setShowFeedback(true)} />
    </div>
  );
};

export default MainLayout;
