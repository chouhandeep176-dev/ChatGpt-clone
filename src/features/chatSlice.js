import { createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router";
import { current } from "@reduxjs/toolkit";

import {
  fetchChats,
  storeChatDB,
  deleteChatDB,
} from "../asyncThunks/chatThunks.js";

const initialState = {
  //TODO: get chats from DB using "model.find" => [{doc1}, {doc2}, {doc3}] (in express)
  chats: [], //  start empty, data comes from backend
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chatEditor",

  initialState,

  reducers: {
    copyChat: (state, action) => {
      // get target chat from the index in payload of action -->
      const targetChatIdx = action.payload;
      const chat = state.chats[targetChatIdx];

      // create the text to copy -->
      const text = `Query : ${chat.query} \n\nResponse: ${chat.response} \n`;

      // Now copy to clipboard -->
      navigator.clipboard.writeText(text);

      alert("copied");
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔹 fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 add chat
      .addCase(storeChatDB.fulfilled, (state, action) => {
        state.chats.unshift(action.payload); // recent first
      })

      // 🔹 delete chat
      .addCase(deleteChatDB.fulfilled, (state, action) => {
        state.chats = state.chats.filter((chat) => chat._id !== action.payload);
      });
  },
});

// Action creators are generated for each case reducer function
export const {copyChat } = chatSlice.actions;
export default chatSlice.reducer;
