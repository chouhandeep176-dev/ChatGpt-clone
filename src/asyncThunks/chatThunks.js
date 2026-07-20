import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, thunkAPI) => {
    try {
      const url = 1;
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASS_URL}/user/allChats`,
      );
      const resData = await res.json();

      if (!res.ok || !resData.success) {
        return thunkAPI.rejectWithValue("Failed to fetch chats");
      }

      return resData.chats;
    } catch (err) {
      console.log("error fething chats : ", err);
      return thunkAPI.rejectWithValue("Failed to fetch chats");
    }
  },
);

export const storeChatDB = createAsyncThunk(
  "chat/storeChatDB",
  async (chat, thunkAPI) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASS_URL}/user/chat`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(chat),
        },
      );

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        return thunkAPI.rejectWithValue("Store failed");
      }

      console.log("chat stored response : ", resData);

      return chat;
    } catch (err) {
      console.log("error fething chats : ", err);
      return thunkAPI.rejectWithValue("Failed to fetch chats");
    }
  },
);

export const deleteChatDB = createAsyncThunk(
  "chat/deleteChatDB",
  async (chatId, thunkAPI) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASS_URL}/user/chat`,
        {
          method: "delete",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ chatId }),
        },
      );

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        return thunkAPI.rejectWithValue("Delete failed");
      }

      console.log("chat deleted response : ", resData);

      return chatId;
    } catch (err) {
      console.log("error fething chats : ", err);
      return thunkAPI.rejectWithValue("Failed to fetch chats");
    }
  },
);
