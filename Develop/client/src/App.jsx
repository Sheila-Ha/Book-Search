import "./App.css";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
