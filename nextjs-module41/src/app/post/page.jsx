import Post from '@/Components/Post';
import React, { Suspense } from 'react';

const PostDetails = () => {

    const playerPromise = fetch('https://jsonplaceholder.typicode.com/albums').then(res => res.json());

    return (
        <div>

            <Suspense fallback={<h2>Loading...........</h2>}>
                <Post playerPromise={playerPromise}></Post>
            </Suspense>
            
        </div>
    );
};

export default PostDetails;