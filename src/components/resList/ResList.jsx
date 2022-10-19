import React from 'react';
import styles from './ResList.module.css'

const ResList = (
    {
        interestingProf,
        notInterestingProf,
        onRepeatClick
    }) => {
    return (
        <div className={styles.container}>
            <div className={styles.links_container}>
                <div className={styles.link_block}>
                    <span>Интересные профессии</span>
                    {interestingProf.map(prof => {
                        return <a style={{color: 'blue'}}
                                  href={'https://docs.google.com/document/d/1-rNC2pjG6NMbzgodPauzlE99v4epNjhWspUY0J4b9JQ/edit#'}
                                  key={prof.id}>{prof.title}</a>
                    })}
                </div>
                <div className={styles.link_block}>
                    <span>Не интересные профессии</span>
                    {notInterestingProf.map(prof => {
                        return <a style={{color: 'red', padding: 5}}
                                  href={'https://docs.google.com/document/d/1-rNC2pjG6NMbzgodPauzlE99v4epNjhWspUY0J4b9JQ/edit#'}
                                  key={prof.id}>{prof.title}</a>
                    })}
                </div>
            </div>
            <div className={styles.btn_block}>
                <button onClick={onRepeatClick}>повторить</button>
            </div>
        </div>
    );
};

export default ResList;
