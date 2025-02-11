import React from "react";

function ErrorPage() {
  return (
    <center>
      <h1
        style={{
          display: "flex",
          color: "red",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        404 Not Found!
      </h1>
    </center>
  );
}

export default ErrorPage;
