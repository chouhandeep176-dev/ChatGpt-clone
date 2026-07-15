import { createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router";
import { current } from "@reduxjs/toolkit";


const initialState = {
  chats: localStorage.getItem("chats")
    ? JSON.parse(localStorage.getItem("chats"))
    : [],
};

export const chatSlice = createSlice({
  name: "chatEditor",

  initialState,

  reducers: {
    addChat: (state, action) => {
      const chat = action.payload;

      // update chats -->
      state.chats.push(chat);

      // update local storage also -->
      localStorage.setItem("chats", JSON.stringify(state.chats));

      // ✅ Log chats state using Immer
      console.log("All chats from slice :", current(state.chats));
    },

    deleteChat: (state, action) => {
      const targetChatIdx = action.payload;

      // delete target chat using the given index in payload -->
      state.chats.splice(targetChatIdx, 1);

      // update local stoage entries -->
      localStorage.setItem("chats", JSON.stringify(state.chats));
    },

    copyChat: (state, action) => {
      // get target chat from the index in payload of action -->
      const targetChatIdx = action.payload;
      const chat = state.chats[targetChatIdx];

      // create the text to copy -->
      const text = `Query : ${chat.query} \n\nResponse: ${chat.response} \n`;

      // Now copy to clipboard -->
      navigator.clipboard.writeText(text);

      alert("copied")
    },

    // openChat: (state, action) => {
    //   let navigate = useNavigate();

    //   const chat = action.payload;

    //   // go to that chat -->
    //   navigate(`/search/${chat.id}`, {
    //     state: {
    //       cameToOpen: true,
    //       query: chat.query,
    //       response: chat.response,
    //     },
    //   });
    // },


  },
});

// Action creators are generated for each case reducer function
export const { addChat, deleteChat, openChat, copyChat } = chatSlice.actions;
export default chatSlice.reducer;
