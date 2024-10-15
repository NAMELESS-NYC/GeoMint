// App.jsx
import React, { useState } from "react";
import { Router, Route } from "wouter";
import styles from "./app.module.scss";
import CreateGeos from "./pages/createGeos/createGeos";
import MyGeos from "./pages/myGeos/myGeos";
import Header from "./components/header/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [page, setPage] = useState("/");
  return (
    <>
      <ToastContainer />
      <div className={styles.header}>
        <Header setPage={setPage} />
      </div>
      <div className={styles.appContainer}>
        {page === "/my-geos" ? <MyGeos /> : <CreateGeos />}
      </div>
    </>
  );
};

export default App;
