import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    isOpenHeaderMenu: false,
    darkModeComponent: true,
    myInfo: null,
    allPosts: [],
    user:{}
  },
  reducers: {
    toggleheaderMenu: (state, actions) => {
      console.log(actions.payload);
      state.isOpenHeaderMenu = actions.payload;
    },
    toggleDarkModeComponent: (state, actions) => {
      state.darkModeComponent = actions.payload;
    },
    addMyInfo: (state, actions) => {
      state.myInfo = actions.payload;
    },
    addToAllPost: (state, actions) => {
      let newPosts = [...actions.payload.posts];
      if (state.allPosts.length === 0) {
        state.allPosts = newPosts;
        return;
      }

      const existingPosts = [...state.allPosts];
      newPosts.forEach((e) => {
        const existingIndex = existingPosts.findIndex((i) => i._id === e._id);
        if (existingIndex !== -1) {
          existingPosts[existingIndex] = e;
        } else {
          existingPosts.push(e);
        }
        state.allPosts = existingPosts;
      });
    },
    addUser:(state,actions)=>{
      state.user = actions.payload
    },
    addSingle:(state,actions)=>{
      let newArr = [...state.allPosts];
      let updatedArr = [actions.payload.post,...newArr]
      let uniqueArr = new Set();
      let uniquePosts = updatedArr.filter((e)=>{
        if(!uniqueArr.has(e._id)){
          uniqueArr.add(e)
          return true
        }
        return false
      })
      state.allPosts = [...uniquePosts]
    }
  },
});

export const {
  toggleheaderMenu,
  toggleDarkModeComponent,
  addMyInfo,
  addToAllPost,
  addUser,
  addSingle 
} = serviceSlice.actions;
export default serviceSlice.reducer;
