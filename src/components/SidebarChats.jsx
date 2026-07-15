import React, { useRef, useState, useEffect } from "react";
import Menu from "./Menu";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import SidebarChat from "./SidebarChat";

const SidebarChats = () => {
  // all chats -->
  const chats = useSelector((state) => state.chatEditor.chats);

  // slected chat index tracking for styling -->
  const [selectedChatIdx, setSelectedChatIdx] = useState(-1)

  // JSX -->
  return (
    <div
      id="sidebar-chats"
      className=" pb-[5.7rem] w-full px-2 h-full flex flex-col items-start gap-1  overflow-y-scroll"
    >
      {/* //! dynamic side bar chats -->  */}
      {chats.map((chat, idx) => (
        <SidebarChat
          key={idx}
          chatIdx={idx}
          chat={chat}
          selectedChatIdx={selectedChatIdx}
          setSelectedChatIdx={setSelectedChatIdx}
        />
      ))}
    </div>
  );
};

export default SidebarChats;
