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
      {posts.map(post => (
        <CommentCard 
          posts={post} 
          users={post.Users} 
          key={post.id} 
          overrides={{
            Share: {
              onClick: async () => {
                const postToChange = await DataStore.query(Posts, post.id);
                await DataStore.save(Posts.copyOf(postToChange, updated => {
                  updated.likes += 1;
                }));

                // ローカルステートを更新
                setPosts(prevPosts =>
                  prevPosts.map(p =>
                    p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                  )
                );
              }
            }
          }}
        />
      ))}
    </div>
  );
}

export default App;
