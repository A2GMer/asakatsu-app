import React, { useEffect, useState } from 'react';
import { DataStore } from 'aws-amplify/datastore';
import { Posts, Users } from '../models';
import { CommentCard } from '../ui-components';

function PostsList() {
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
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleLike = async (postId) => {
    const postToChange = await DataStore.query(Posts, postId);
    await DataStore.save(Posts.copyOf(postToChange, updated => {
      updated.likes += 1;
    }));

    // ローカルステートを更新
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  return (
    <div>
      {posts.map(post => (
        <CommentCard
          posts={post}
          users={post.Users}
          key={post.id}
          overrides={{
            Share: {
              onClick: () => handleLike(post.id),
            },
          }}
        />
      ))}
    </div>
  );
}

export default PostsList;
