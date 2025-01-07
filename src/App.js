import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import PostsList from './components/PostsList';


export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <PostsList />
        </main>
      )}
    </Authenticator>
  );
}