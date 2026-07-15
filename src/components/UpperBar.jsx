import React from "react";
import { NavLink } from "react-router";
import Newchat from "./Newchat";

const UpperBar = ({ triggerReload }) => {

  // JSX -->
  return (

    <div className="min-h-[9%] w-full bg-[#212121] border-b-[1px] border-gray-600 flex items-center justify-between">
      
      {/* Chta gpt icon -->  */}
      <NavLink
        onClick={triggerReload}
        className="text-white text-[1.2rem] ml-2 hover:bg-[#3f3f3f] py-1 px-3 rounded-xl"
        href="/"
      >
        
        ChatGPT
      
      </NavLink>

      {/* // upper bar right box --> */}
      <Newchat displayShortcutKeys={false} triggerReload={triggerReload} widthFull={false}/>

    </div>

  );
};

export default UpperBar;
