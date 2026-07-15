import React, { useContext } from "react";
import { addChat, deleteChat, openChat, copyChat } from "../features/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { ChatContext } from "./SidebarChat";
import { useNavigate } from "react-router";

const MenuBtn = ({ forCopy, forOpen, forDelete }) => {
  const chatContextdata = useContext(ChatContext);

  // fetching context data -->
  const setSelectedChatIdx = chatContextdata.setSelectedChatIdx;
  const chat = chatContextdata.chat;
  const setShowMenu = chatContextdata.setShowMenu;

  const dispatch = useDispatch();

  // navigate -->
  const navigate = useNavigate();

  //! JSX -->
  return (
    <div
      onClick={() => {
        if (forCopy) {

          dispatch(copyChat(chatContextdata.chatIdx));

        } else if (forDelete) {

          dispatch(deleteChat(chatContextdata.chatIdx));


          // reset selected chat index so UI doesn't break
          setSelectedChatIdx(null);

          // close menu -->
          setShowMenu(false);

          // wait a tick so redux + context finish updating
          setTimeout(() => {
            navigate("/");
          }, 0);
        } else {
          //! open -->

          // set this as selected chat -->
          setSelectedChatIdx(chatContextdata.chatIdx);

          // close menu -->
          setShowMenu(false);

          // navigate to chat -->
          navigate(`/search/${chat._id}`, {
            state: {
              chat: chat,
            },
          });
        }
      }}
      id="menu-btn"
      className={`${
        forDelete ? "hover:bg-[#ff575730]" : "hover:bg-[#515151]"
      }  w-auto h-auto flex items-center gap-2 py-2 pr-8 pl-2 rounded-xl`}
    >
      {/* //! copy icon -->  */}
      <svg
        className={`${forDelete && "fill-[#ff5757]"}`}
        xmlns="http://www.w3.org/2000/svg"
        height="21px"
        viewBox="0 -960 960 960"
        width="21px"
        fill="#FFFFFF"
      >
        {forCopy ? (
          <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
        ) : forOpen ? (
          <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
        ) : (
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        )}
      </svg>

      {/* //! Menu button text  --> */}
      <p
        className={` font-[.8rem] ${
          forDelete ? "text-[#ff5757]" : "text-white"
        } `}
      >
        {forCopy ? "Copy" : forOpen ? "Open" : "Delete"}
      </p>
    </div>
  );
};

export default MenuBtn;


