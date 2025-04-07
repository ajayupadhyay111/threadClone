import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Home from "./pages/Protected/Home";
import Search from "./pages/Protected/Search";
import Error from "./pages/Error";
import Register from "./pages/Register";
import ProtectedLayout from "./pages/Protected/ProtectedLayout";
import ProfileLayout from "./pages/Protected/ProfileLayout";
import Threads from "./components/ProfileLayout/Threads";
import Replies from "./components/ProfileLayout/Replies";
import Reposts from "./components/ProfileLayout/Reposts";
import SinglePost from "./pages/Protected/SinglePost";
import Activity from "./pages/Protected/Activity";
import { useMyInfoQuery } from "./redux/service";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Mingle from "./pages/Mingle";

const App = () => {
  const myInfo = useSelector((state) => state.service.myInfo);
  useMyInfoQuery();

  return (
    <div className="h-screen">
      <BrowserRouter>
        <Routes>
          {myInfo ? (
            <Route path="/" element={<ProtectedLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="activity" element={<Activity />} />
              <Route path="mingle" element={<Mingle />} />
              <Route path="profile/" element={<ProfileLayout />}>
                <Route path="threads/:id" element={<Threads />} />
                <Route path="replies/:id" element={<Replies />} />
                <Route path="reposts/:id" element={<Reposts />} />
              </Route>
              <Route path="post/:id" element={<SinglePost />} />
            </Route>
          ) : (
            <Route path="/" element={<Register />} />
          )}
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
};
export default App;
