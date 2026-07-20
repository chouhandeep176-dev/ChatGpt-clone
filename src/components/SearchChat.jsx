import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";


const SearchChat = ({ idx, chat }) => {
  const navigate = useNavigate();

  /* // structure --> */
  return (
    <div
      id="chat"
      onClick={() => {
        navigate(`/search/${chat._id}`, {
          state: {
            chat: chat,
          },
        });
      }}
      className="w-full  h-auto pb-3 pt-2 first:pt-0 hover:bg-[#3f3f3f] flex items-center gap-2 border-b-1 border-gray-500"
    >
      {/* chat icon --> */}
      <svg
        className="w-[5%]"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
      >
        <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
      </svg>

      {/* query and response in a chat -->  */}
      <div className="w-[75%] overflow-hidden">
        <h2 className=" text-[1.1rem] text-white min-w-0  font-semibold">
          {chat.query}
        </h2>

        <div className="max-h-[1.2rem] overflow-hidden text-[.85rem] text-[#a6a6a6]">
          <ReactMarkdown>{chat.response}</ReactMarkdown>
        </div>
      </div>

      {/* date of the chat -->  */}
      <p className="text-[.9rem] pr-2 w-[20%] h-full text-white flex items-center justify-end text-end font-semibold">
        {chat.date}
      </p>
    </div>
  );
};

export default SearchChat;
