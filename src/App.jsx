import { useState } from "react";
import Main from "./components/Main";
import * as Tooltip from "@radix-ui/react-tooltip";

import { store } from "./store";
import { Provider } from "react-redux";

import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/Layout";
import Search from "./components/Search";
import View from "./components/View";

let router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Main /> },
      { path: "main", element: <Main /> },
      { path: "search", element: <Search /> },
      { path: "search/:chatId", element: <Main /> },
    ],
  },
]);

function App() {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Tooltip.Provider>
  );
}

export default App;
