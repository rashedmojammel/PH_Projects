import React, { use } from 'react';

const Post = ({playerPromise}) => {

    const player = use(playerPromise);
    console.log(player);
    return (
        <div>
            <h2>length : {player.length}</h2>
            
        </div>
    );
};

export default Post;