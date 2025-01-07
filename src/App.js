import logo from './logo.svg';
import './App.css';

import { DataStore } from 'aws-amplify/datastore';
import { Posts, Users } from './models';
import { CommentCard } from './ui-components';

import { useEffect, useState } from 'react';

function App() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const data = await DataStore.query(Posts);
    // setPosts(data);
    // Usersデータを解決
    const postsWithUsers = await Promise.all(
      data.map(async post => {
        const user = await DataStore.query(Users, post.postsUsersId);
        return { ...post, Users: user };
      })
    );

    setPosts(postsWithUsers);
  }

  useEffect(() => {
    getPosts()
  }, []);

  return (
    <div>
      { posts.map(post => {
          return <CommentCard posts={post} users={post.Users} key={post.id} />;
        }
        )
      }
    </div>
  );
}

export default App;
