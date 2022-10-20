import React, {useState} from 'react';
import styles from './Player.module.css'

const Player = ({videoData, onChoose}) => {
    const {videosList, title, desc, subDesc, id} = videoData
    const [srs, setSrc] = useState(0)

    const srsLength = videosList.length

    const onProfClick = () => {
        onChoose(id)
        setSrc(0)
    }

    const onFollowClick = () => {
        if (srs < srsLength - 1) {
            setSrc(srs + 1)
        } else {
            setSrc(0)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.video_block}>
                <h1 className={styles.title}>{title}</h1>
                <video onEnded={onFollowClick}
                       controls src={videosList[srs].src} width={'700px'}
                       height={'400px'}/>
                <div className={styles.video_desc}>{videosList[srs].desc}</div>
                <div className={styles.follow_btn}>
                    <span className={srsLength <= 1 ? styles.disabled : styles.next_btn}
                          onClick={onFollowClick}>
                        Показать следующее видео
                    </span>
                </div>
                <div>{desc}</div>
                <div>{subDesc}</div>
            </div>

            <div className={styles.prof_btn_block}>
                <button className={styles.prof_btn} onClick={onProfClick}>{title}</button>
            </div>
        </div>
    );
};

export default Player;
