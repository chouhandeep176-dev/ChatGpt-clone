import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import * as Tooltip from "@radix-ui/react-tooltip";

import { addChat, deleteChat, openChat, copyChat } from "../features/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function Main() {
  const location = useLocation();

  // qury and response states -->
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  // useeffect for setting Main comp as view Comp -->
  useEffect(() => {
    if (location.state?.chat) {
      const chatToView = location.state.chat;
      setChatStarted(true);
      setResponse(chatToView.response);
      setQuery(chatToView.query);
      setLastQuery(chatToView.query);
    } else {
      // No chat in state → reset
      setChatStarted(false);
      setResponse("");
      setQuery("");
      setLastQuery("");
    }
  }, [location.state]);

  // chat started flag -->
  const [chatStarted, setChatStarted] = useState(
    location.state?.chat ? true : false,
  );

  const [loading, setLoading] = useState(false);

  // isEdiatble state for making upper textarea readonly and editable time to time -->
  const [isEditable, setIsEditable] = useState(false);

  // last query tracker -->
  const [lastQuery, setLastQuery] = useState("");

  // change copy1, copy2 and search icons -->
  const [copyDone, setCopyDone] = useState(false);
  const [copyDone2, setCopyDone2] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  function changeCopyIcon(iconNumber = 1) {
    if (iconNumber == 1) {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } else {
      setCopyDone2(true);
      setTimeout(() => setCopyDone2(false), 2000);
    }
  }

  function changeSearchIcon() {
    setSearchDone(true);
    setTimeout(() => setSearchDone(false), 2000);
  }

  // dispatch hook -->
  const dispatch = useDispatch();

  // response from the API -->
  const getGeminiResponse = async (calledFromUpperInput) => {
    // loading has started -->
    setLoading(true);

    // chat started flag -->
    setChatStarted(true);

    // update last query on the basis of from where api call is made -->
    calledFromUpperInput ? setLastQuery(lastQuery) : setLastQuery(query);

    const apiKey = import.meta.env.VITE_API_KEY; // ref: https://console.groq.com/docs/api-reference#chat-create
    const url = "https://api.groq.com/openai/v1/chat/completions";

    console.log("URL:", url);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`, // Key here
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // model required
          messages: [
            {
              role: "user",
              content: calledFromUpperInput ? lastQuery : query, // user question
            },
          ],
        }),
      });

      const data = await res.json();
      const finalResponse =
        data?.choices?.[0]?.message?.content || "No response try again";

      setResponse(finalResponse);
    } catch (err) {
      console.error(err);
      setResponse("⚠️ API error, try again later");
    }

    // loading has ended -->
    setLoading(false);

    // fetch date -->
    const newDate = new Date();
    const date = newDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // store chat data in the local storage -->
    const newChat = {
      query: calledFromUpperInput ? lastQuery : query,
      response: finalResponse,
      date: date,
      _id: crypto.randomUUID(),
    };

    // dispatch addChat action as sson as we get a chat -->
    dispatch(addChat(newChat));

    return finalResponse;
  };

  // like factor for feedback purpose -->
  const [likeFactor, setLikeFactor] = useState(-1); // -1: don't know, 1: like response, 0: deslike response

  // reload or reinitialize likeFactor when user reloads response -->
  useEffect(() => {
    setLikeFactor(-1);
  }, [response]);

  // structure -->
  return (
    <div
      id="main-content"
      className="w-full h-[91%] bg-[#212121] flex flex-col"
    >
      {/* Upper box -->  */}
      <div
        id="main-upper-box"
        className="flex flex-col justify-start items-center  w-full h-[74%] px-[15%] overflow-scroll overflow-x- pt-4"
      >
        {/* heading of welcome use -->  */}
        {!chatStarted && (
          <h1
            id="welcome-user"
            className="text-white text-4xl tracking-wide w-full h-full flex items-center justify-center text-center"
          >
            Where should we begin?
          </h1>
        )}

        {/* // user asked query, only when we have a response --> */}
        {chatStarted && (
          <div
            id="user-query-upper-container"
            className="w-[75%] h-auto flex flex-col justify-start self-end overflow-hidden"
          >
            {/* render upper textarea only when we have a response -->  */}

            <textarea
              readOnly={!isEditable}
              value={lastQuery}
              onChange={(e) => {
                setLastQuery(e.target.value);
                // autoSize(e); // ← call here,
              }}
              id="user-query-upper-input"
              className={`${
                isEditable ? "bg-[#545454]" : "bg-[#303030]"
              } leading-[1.5] box-border text-white p-2 placeholder:text-[#a6a6a6] placeholder:text-[1.1rem] w-full min-h-[4rem] max-h-[10rem] overflow-y-auto  focus:outline-none focus:ring-0 resize-none rounded-xl border-[1px] border-gray-600 bg-[#303030]`}
            ></textarea>

            {/* // copy and edit utility btns -->  */}
            <div
              id="user-query-upper-utility-btns"
              className="w-full h-[1.9rem] flex justify-end gap-1 items-center mt-2"
            >
              {/* // copy -->  */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <svg
                    onClick={(e) => {
                      navigator.clipboard.writeText(lastQuery);

                      changeCopyIcon();
                    }}
                    className="icon-style"
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="#e3e3e3"
                  >
                    {
                      !copyDone ?
                        // copy icon -->
                        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                        // tick icon -->
                      : <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />

                    }
                  </svg>
                </Tooltip.Trigger>

                {/* The tooltip itself */}
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    align="center"
                    className="popup-style"
                  >
                    Copy
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              {/* // show edit and send button conditionally -->  */}

              {
                isEditable ?
                  // show send button -->
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <svg
                        onClick={(e) => {
                          getGeminiResponse(true);
                          changeSearchIcon();

                          // textarea no longer editable after submission of query -->
                          setIsEditable(false);

                          // Force resize in editable state -->
                          const textarea = document.getElementById(
                            "user-query-upper-input",
                          );

                          const markdown = document.getElementById("markdown");

                          if (textarea) {
                            textarea.style.height = "auto";
                            textarea.style.minHeight = "3.2rem";
                            markdown.style.height = "65%";
                          }
                        }}
                        className="hover:bg-[#3f3f3f] p-1 rounded-[7px]"
                        xmlns="http://www.w3.org/2000/svg"
                        height="28px"
                        viewBox="0 -960 960 960"
                        width="28px"
                        fill="#e3e3e3"
                      >
                        <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                      </svg>
                    </Tooltip.Trigger>

                    {/* The tooltip itself */}
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="bottom"
                        align="center"
                        className="popup-style"
                      >
                        Send
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                  // edit button -->
                : <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <svg
                        onClick={(e) => {
                          setIsEditable(true);

                          // Force resize in editable state -->
                          const textarea = document.getElementById(
                            "user-query-upper-input",
                          );

                          const markdown = document.getElementById("markdown");

                          if (textarea) {
                            textarea.style.height = "auto";
                            textarea.style.minHeight = "8rem";
                            markdown.style.height = "50%";
                          }
                        }}
                        className="hover:bg-[#3f3f3f] p-1 rounded-[7px]"
                        xmlns="http://www.w3.org/2000/svg"
                        height="28px"
                        viewBox="0 -960 960 960"
                        width="28px"
                        fill="#e3e3e3"
                      >
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                      </svg>
                    </Tooltip.Trigger>

                    {/* The tooltip itself */}
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="bottom"
                        align="center"
                        className="popup-style"
                      >
                        Edit Message
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>

              }
            </div>
          </div>
        )}

        {/* Render preloader or response while loading --> */}
        {loading ?
          <div
            id="preloader"
            className="w-full mt-8 h-[62%] py-4 flex flex-col justify-end items-start"
          >
            <div className="w-[30%] h-[15%] mb-2 bg-gray-500 rounded-xl pulse-loader"></div>
            <div className="w-full h-[15%] mb-2 bg-gray-500 rounded-xl pulse-loader"></div>
            <div className="w-[90%] h-[15%] mb-2 bg-gray-500 rounded-xl pulse-loader"></div>
            <div className="w-[43%] h-[15%] mb-2 bg-gray-500 rounded-xl pulse-loader mt-4"></div>
            <div className="w-full h-[15%] mb-2 bg-gray-500 rounded-xl pulse-loader"></div>
            <div className="w-[80%] h-[15%] mb-2 bg-gray-500 rounded-xl pulse-loader"></div>
          </div>
        : <div
            id="markdown"
            className="max-h-[62%] animate"
            style={{ "--chars": response.length }}
          >
            <ReactMarkdown>{response}</ReactMarkdown>

            {/* // response utility btns --> */}
            {chatStarted && (
              <div
                id="response-utility-btns"
                className="w-full h-[1.9rem] flex justify-start gap-1 items-center mt-4"
              >
                {/* // copy icon for response -->  */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <svg
                      onClick={(e) => {
                        navigator.clipboard.writeText(response);

                        changeCopyIcon(2);
                      }}
                      className="hover:bg-[#3f3f3f] p-1 rounded-[7px]"
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#e3e3e3"
                    >
                      {
                        !copyDone2 ?
                          // copy icon -->
                          <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                          // tick icon -->
                        : <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />

                      }
                    </svg>
                  </Tooltip.Trigger>

                  {/* The tooltip itself */}
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      align="center"
                      className="popup-style"
                    >
                      Copy
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* // thumbs like icon for response -->  */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <svg
                      onClick={() => {
                        setLikeFactor(1);
                      }}
                      className={`hover:bg-[#3f3f3f] p-1 rounded-[7px] ${
                        likeFactor === 0 ? "hidden" : ""
                      }
                  ${
                    likeFactor === 1 ?
                      "bg-gray-300 fill-black hover:bg-gray-300"
                    : ""
                  }
                  `}
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#e3e3e3"
                    >
                      <path d="M720-144H264v-480l288-288 32 22q17 12 26 30.5t5 38.5l-1 5-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906-467L786.93-187.8Q778-168 760-156t-40 12Zm-384-72h384l120-279v-57H488l49-243-201 201v378Zm0-378v378-378Zm-72-30v72H120v336h144v72H48v-480h216Z" />{" "}
                    </svg>
                  </Tooltip.Trigger>

                  {/* The tooltip itself */}
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      align="center"
                      className="popup-style"
                    >
                      Good response
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* // thumbs dislike for response -->  */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <svg
                      onClick={() => {
                        setLikeFactor(0);
                      }}
                      className={`hover:bg-[#3f3f3f] p-1 rounded-[7px] ${
                        likeFactor === 1 ? "hidden" : ""
                      } 
                  ${
                    likeFactor === 0 ?
                      "bg-gray-300 fill-black hover:bg-gray-300"
                    : ""
                  }
                  `}
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#e3e3e3"
                    >
                      <path d="M240-816h456v480L408-48l-32-22q-17-12-26-30.5t-5-38.5l1-5 38-192H120q-30 0-51-21t-21-51v-57q0-8 1.5-14.5T54-493l119-279q8-20 26.5-32t40.5-12Zm384 72H240L120-465v57h352l-49 243 201-201v-378Zm0 378v-378 378Zm72 30v-72h144v-336H696v-72h216v480H696Z" />{" "}
                    </svg>
                  </Tooltip.Trigger>

                  {/* The tooltip itself */}
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      align="center"
                      className="popup-style"
                    >
                      Bad response
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* // retry for response -->  */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <svg
                      onClick={(e) => {
                        getGeminiResponse(true);
                      }}
                      className="hover:bg-[#3f3f3f] p-1 rounded-[7px]"
                      xmlns="http://www.w3.org/2000/svg"
                      height="30px"
                      viewBox="0 -960 960 960"
                      width="30px"
                      fill="#e3e3e3"
                    >
                      <path d="M227-346q-16-30-25.5-63.5T192-480q0-121 85-206t209-82l-57-57 51-51 144 144-144 144-51-51 57-57q-94-2-158 62t-64 154q0 22 4 42t12 39l-53 53ZM480-84 336-228l144-144 51 51-57 57q94 2 158-62t64-154q0-22-4-42t-12-39l53-53q16 30 25.5 63.5T768-480q0 120-85 205.5T474-192l57 57-51 51Z" />{" "}
                    </svg>
                  </Tooltip.Trigger>

                  {/* The tooltip itself */}
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      align="center"
                      className="popup-style"
                    >
                      Try again
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>
            )}
          </div>
        }
      </div>

      {/*  bottom box --> */}
      <div id="main-bottom-box" className="w-full h-[26%] px-[15%]">
        {/* input for query --> */}
        <div
          id="query-input"
          className="w-full h-[82%] bg-[#303030] flex justify-start overflow-hidden rounded-3xl border-[1px] border-gray-600"
        >
          <textarea
            id="bottom-query-textarea"
            placeholder="Ask anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-full text-white w-[90%] focus:outline-none resize-none focus:ring-0 p-4 overflow-scroll placeholder:text-[#a6a6a6] placeholder:text-[1.1rem]"
          ></textarea>

          {/* search icon -->  */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <svg
                className="bg-[#303030] mt-4 mr-2"
                onClick={(e) => {
                  getGeminiResponse(false);
                  changeSearchIcon();
                }}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#a6a6a6"
              >
                {
                  searchDone ?
                    // tick icon -->
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    // search icon -->
                  : <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />

                }
              </svg>
            </Tooltip.Trigger>

            {/* The tooltip itself */}
            <Tooltip.Portal>
              <Tooltip.Content
                side="bottom"
                align="center"
                className="popup-style"
              >
                Get response
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        <p className="text-xs w-full text-center text-white mt-1">
          ChatGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default Main;
