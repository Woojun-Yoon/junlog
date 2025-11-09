import React from "react";

import "./index.scss";
import { Logo } from "../Logo/Logo";

const BeforeLogin: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        textAlign: "center",
        marginBottom: "3rem",
      }}
    >
      <Logo />
    </div>
  );
};

export default BeforeLogin;
