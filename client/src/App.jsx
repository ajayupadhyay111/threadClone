import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMyInfoQuery } from "./redux/service";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Loading from "./components/common/Loading";

// Lazy load components
const Home = lazy(() => import("./pages/Protected/Home"));
const Search = lazy(() => import("./pages/Protected/Search"));
const Error = lazy(() => import("./pages/Error"));
const Register = lazy(() => import("./pages/Register"));
const ProtectedLayout = lazy(() => import("./pages/Protected/ProtectedLayout"));
const ProfileLayout = lazy(() => import("./pages/Protected/ProfileLayout"));
const Threads = lazy(() => import("./components/ProfileLayout/Threads"));
const Replies = lazy(() => import("./components/ProfileLayout/Replies"));
const Reposts = lazy(() => import("./components/ProfileLayout/Reposts"));
const SinglePost = lazy(() => import("./pages/Protected/SinglePost"));
const Activity = lazy(() => import("./pages/Protected/Activity"));
const Mingle = lazy(() => import("./pages/Mingle"));

const App = () => {
  const myInfo = useSelector((state) => state.service.myInfo);
  useMyInfoQuery();

  return (
    <div className="h-screen">
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="h-screen flex items-center justify-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            </div>
          }
        >
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
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

export default App;
