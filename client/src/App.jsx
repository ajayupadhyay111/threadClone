import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
const App = () => {
  const myInfo = useSelector(state=>state.service.myInfo)
  useMyInfoQuery()
  return (
    <>
      <div className="h-screen">
        <BrowserRouter>
          {/* <Header /> */}
          <Routes>
            {myInfo ? (
              <Route exact path="/" element={<ProtectedLayout />}>
                <Route exact path="" element={<Home />} />
                <Route exact path="search" element={<Search />} />
                <Route exact path="activity" element={<Activity />} />
                <Route exact path="profile" element={<ProfileLayout />}>
                  <Route exact path="threads" element={<Threads />} />
                  <Route exact path="replies/:id" element={<Replies />} />
                  <Route exact path="reposts/:id" element={<Reposts />} />
                </Route>
                <Route exact path="post/:id" element={<SinglePost />} />
              </Route>
            ) : (
              <Route exact path="/" element={<Register />} />
            )}
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
