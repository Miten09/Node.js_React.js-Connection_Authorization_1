import React, { useEffect } from "react";
import "./Home.scss";
import { axiosClient } from "../../utils/axiosClient";

function Home() {
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await axiosClient.get("/posts/all");
    console.log("got the response", response);
  }

  return <>Home</>;
}

export default Home;
