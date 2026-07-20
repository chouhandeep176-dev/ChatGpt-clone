import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";

import { fetchChats } from "../asyncThunks/chatThunks.js";


import Sidebar from "./Sidebar";
import UpperBar from "./UpperBar";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";


const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //reload state to force </Main> to remount -->
  const [reload, setReload] = useState(0);

  function triggerReload() {
    setReload((reload) => reload + 1);
  }

  // allow shortcut keys for search chat and opening new chat -->
  useEffect(() => {
    function handleShortcut(e) {
      // Check for CTRL + SHIFT + O for new chat
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault(); // avoid browser default

        triggerReload();
        // clear previous location states -->
        navigate("/", { state: null });
      }

      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault(); // avoid browser default
        navigate("/search");
      }
    }

    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, [navigate, triggerReload]);

  //! load chats from database at layout-->
  useEffect(() => {
    dispatch(fetchChats());
  }, []);

  // JSX -->
  return (
    <div id="layout" className="flex w-screen h-screen">
      <Sidebar triggerReload={triggerReload} />

      <div
        id="upperbar-outlet-container"
        className="flex flex-col flex-1 h-full"
      >
        <UpperBar triggerReload={triggerReload} />

        <Outlet key={reload} />
      </div>
    </div>
  );
};;

export default Layout;
