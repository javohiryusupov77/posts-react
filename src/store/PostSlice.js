import { createSlice } from '@reduxjs/toolkit';

const initPost = [
  {
    id: 1,
    title: 'My First Post',
    datetime: 'July 01, 2021 11:17:36 AM',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!',
  },
  {
    id: 2,
    title: 'My 2nd Post',
    datetime: 'July 01, 2021 11:17:36 AM',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!',
  },
  {
    id: 3,
    title: 'My 3rd Post',
    datetime: 'July 01, 2021 11:17:36 AM',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!',
  },
  {
    id: 4,
    title: 'My Fourth Post',
    datetime: 'July 01, 2021 11:17:36 AM',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!',
  },
];

const postsSlice = createSlice({
  name: 'posts',
  initialState: {posts:[]},
  reducers: {
    addPosts:(state,action)=>{
      state.posts = action.payload
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
     editPost: (state, action) => {
      const { id, title, body } = action.payload;
      const existingPost = state.posts.find(post => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.body = body;
      }
    },
  },
});

export const { addPost, deletePost,editPost,addPosts } = postsSlice.actions;
export default postsSlice.reducer;
