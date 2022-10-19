import React from 'react';
import Player from './player/Player';
import styles from './PlayerList.module.css'

const PlayerList = (
    {
        title,
        title_description,
        title_sub_description,
        activeProfs,
        onHandleChoose
    }
) => {
    return (
        <div className={styles.container}>
            <h1>{title}</h1>
            <div className={styles.desc}>{title_description}</div>
            <div className={styles.sub_desc}>{title_sub_description}</div>

            <div className={styles.players_block}>
                {activeProfs.map((video, i) => {
                    return <Player key={video + i} onChoose={onHandleChoose}
                                   videoData={video}/>
                })}
            </div>
        </div>
    );
};

export default PlayerList;
