import React, { useState } from "react";
import Newchat from "./Newchat";
import { useSelector } from "react-redux";
import SearchChat from "./SearchChat";

function Search() {
  // all chats -->
  const chats = useSelector((state) => state.chatEditor.chats);
  console.log(" all chats : ", chats);

  // search term state -->
  const [searchTerm, setSearchTerm] = useState("");

  // structure -->
  return (
    <div
      id="search-page"
      className="w-full h-[91%] px-[15%] pt-4 flex flex-col gap-4 items-start"
    >
      {/* search chat heading --> */}
      <h1 className="text-white text-3xl pl-[1rem] tracking-wide">
        Search Chat
      </h1>

      {/* search input field -->  */}
      <div className="w-full pl-[1rem] flex gap-3 items-center h-[2.7rem] rounded-3xl border-[1px] border-gray-600">
        {/*  search chat svg --> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="22px"
          viewBox="0 -960 960 960"
          width="22px"
          fill="#FFFFFF"
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>

        <input
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="outline-none w-full text-white placeholder:text-[#a6a6a6] placeholder:text-[1rem]"
          type="text"
          placeholder="Search chat by asked query"
        />
      </div>

      {/* New chat -->  */}
      <Newchat
        displayShortcutKeys={true}
        triggerReload={null}
        widthFull={TextTrackCue}
      />

      {/* chats -->  */}
      <p className="text-[#a6a6a6] font-[.8rem] pl-2">chats</p>

      {/* // all dynamic chats -->   */}
      <div
        id="chats-container"
        className=" w-full max-h-[20rem] overflow-scroll mb-4 px-2 flex flex-col flex-1 gap-2 "
      >
        {/* creatning dynamic chats --> */}
        {chats
          .filter((chat) => chat.query.toLowerCase().includes(searchTerm))
          .map((chat, idx) => {
            return <SearchChat key={idx} idx={idx} chat={chat} />;
          })}
      </div>
    </div>
  );
}

export default Search;
