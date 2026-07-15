import React, { useState } from "react";
import { useNavigate } from "react-router";

const Newchat = ({
  displayShortcutKeys,
  triggerReload,
  widthFull,
  intoSearchChat,
}) => {
  // logic + sates -->
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  // JSX -->

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      id="new-chat"
      onClick={() => {
        // convert new chat into search chat
        if (intoSearchChat) {
          navigate("/search");
        } else {
          triggerReload != null && triggerReload();

          // clear previous location states -->
          navigate("/", { state: null });
        }
      }}
      className={` 
      ${
        widthFull && "w-full"
      } flex items-center gap-2 justify-between hover:bg-[#3f3f3f] py-2 px-3 mr-2 rounded-xl`}
    >
      {/* new chat + svg div -->  */}
      <div className="flex items-center gap-2">
        {/* new chat icon --> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="#ffffffff"
        >
          {/* // convert chat into search icon for search chat --> */}
          {intoSearchChat ? (
            // search icon -->
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          ) : (
            // chat icon
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
          )}
        </svg>

        {/* new chat route --> */}
        <p className="text-white text-[.9rem] font-semibold" href="/">
          {intoSearchChat ? "Search Chat" : "New Chat"}
        </p>
      </div>

      {/* short key for new chat --> */}
      {displayShortcutKeys && (
        <p
          className={`${
            hovered ? "inline-block" : "hidden"
          } text-[#a6a6a6] text-[.9rem] font-semibold`}
        >
          {intoSearchChat ? "Ctrl + K" : "Ctrl + Shift + O"}
        </p>
      )}
    </div>
  );
};

export default Newchat;
