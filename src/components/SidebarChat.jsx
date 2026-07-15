import { useRef, useState, useEffect, createContext, useContext } from "react";
import Menu from "./Menu";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";

  // create context to pass chat IDX -->
  export const ChatContext = createContext();

const SidebarChat = ({
  chatIdx,
  chat,
  selectedChatIdx,
  setSelectedChatIdx,
}) => {

  // navigate -->
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const threeDotsRef = useRef(null);
  const chatRef = useRef(null);

  const [cords, setCords] = useState({ top: 0, left: 0 });

  // update cords when mounted & on scroll
  useEffect(() => {
    if (!chatRef.current) return;

    function updateCords() {
      const chatCord = chatRef.current.getBoundingClientRect();
      setCords({
        top: Math.trunc(chatCord.top),
        left: Math.trunc(chatCord.left) + Math.trunc(chatCord.width),
      });
    }

    updateCords();

    const scrollEl = document.querySelector("#sidebar-chats");
    scrollEl.addEventListener("scroll", updateCords);

    return () => {
      scrollEl.removeEventListener("scroll", updateCords);
    };
  }, [showMenu]);

  return (
    <ChatContext.Provider
      value={{ chatIdx, setSelectedChatIdx, chat, setShowMenu }}
    >
      <div
        ref={chatRef}
        id="side-bar-chat"
        onClick={(e) => {
          // ignore three dots for opening a chat -->
          if (threeDotsRef.current && e.target == threeDotsRef.current) return;

          // set this as selected chat -->
          setSelectedChatIdx(chatIdx);

          // navigate to chat -->
          navigate(`/search/${chat._id}`, {
            state: {
              chat: chat,
            },
          });
        }}
        className={`

        ${selectedChatIdx == chatIdx && "bg-[#242424]"}
        
        group relative  p-2 w-full flex items-center justify-between  hover:bg-[#343434] rounded-xl`}
      >
        <h2 className="text-white text-[.9rem] font-[400] max-h-[1.5rem] overflow-hidden w-[80%]">
          {chat.query}
        </h2>

        {/* three dots */}
        <svg
          ref={threeDotsRef}
          className={`
            
            ${selectedChatIdx == chatIdx && "opacity-100"}

            opacity-0 group-hover:opacity-100`}
          onClick={() => setShowMenu(!showMenu)}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
        </svg>

        {showMenu &&
          createPortal(
            <ChatContext.Provider
              value={{ chatIdx, setSelectedChatIdx, chat, setShowMenu }}
            >
              <Menu
                cords={cords}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                threeDotsRef={threeDotsRef}
              />
            </ChatContext.Provider>,
            document.body
          )}
      </div>
    </ChatContext.Provider>
  );
};

export default SidebarChat;
