import React from "react";
import Newchat from "./Newchat";
import NewChatBtn from "./NewChatBtn";
import SearchChatBtn from "./SearchChatBtn";

function SidebarUtilityBtns({ sidebarOpen, triggerReload }) {
  return (
    //! side bar utility buttons -->
    <div
      id="Sidebar-utility-btns"
      className={` ${!sidebarOpen && "gap-2"} flex flex-col items-center w-full px-2 h-[29%]`}
    >
      {sidebarOpen ? (
        //  todo:  New chat btn -->
        <Newchat
          displayShortcutKeys={true}
          triggerReload={triggerReload}
          widthFull={true}
        />
      ) : (
        <NewChatBtn triggerReload={triggerReload} />
      )}

      {/* //todo:  New chat btn -->  */}

      {sidebarOpen ? (
        <Newchat
          displayShortcutKeys={true}
          triggerReload={triggerReload}
          widthFull={true}
          intoSearchChat={true}
        />
      ) : (
        <SearchChatBtn />
      )}
    </div>
  );
}

export default SidebarUtilityBtns;
