import React, {useEffect, useState} from 'react';
import data from '../../data/data.json';
import ResList from '../resList/ResList';
import PlayerList from '../players/PlayerList';

const Testing = () => {
    const {
        title,
        title_description,
        title_sub_description,
        videos,
        startVideos
    } = data

    const [activeProfs, setActiveProfs] = useState([])
    const [allActiveProf, setAllActiveProf] = useState([])
    const [interestingProf, setInterestingProf] = useState([])
    const [isEnd, setIsEnd] = useState(false)
    const [sortList, setSortList] = useState([])

    useEffect(() => {
        startSet()
    }, [])

    const startSet = () => {
        const startVideo = videos.filter(({id}) => startVideos.includes(id))
        const allProfs = videos.filter(({lvl}) => lvl === 1)
        setAllActiveProf(allProfs)
        setActiveProfs(startVideo)
    }

    //найти менее интересную работу
    const notInterestingId = (videoId) => activeProfs.find(({id}) => id !== videoId).id

    //следующая профессия
    const nextProf = (int, notInt) => {
        let sort = allActiveProf.filter((prof) => prof.id !== int)
        return sort.filter((prof) => prof.id !== notInt)[0]
    }
    const currentProf = (profId) => {
        return allActiveProf.find(({id}) => id === profId)
    }

    const sortProf = (videoId) => {
        if (sortList.length === 0) {
            sortList.push(currentProf(videoId))
            sortList.push(currentProf(notInterestingId(videoId)))

            setActiveProfs([sortList[0], nextProf(videoId, notInterestingId(videoId))])
            setSortList(sortList)
        } else {
            const isThere = sortList.some(({id}) => id === videoId)
            if (isThere) {
                const currentIdxProf = sortList.findIndex(({id}) => id === videoId)
                if(sortList[currentIdxProf + 1]){
                    setActiveProfs([sortList[currentIdxProf + 1], currentProf(notInterestingId(videoId))])
                }else{
                    sortList.push(currentProf(notInterestingId(videoId)))
                    setSortList(sortList)
                    const nextProf = allActiveProf.filter(prof => !sortList.includes(prof))[0]
                    if (nextProf) {
                        setActiveProfs([sortList[0], nextProf])
                    } else {
                        setInterestingProf(sortList)
                        setIsEnd(!isEnd)
                    }
                }

            } else {
                const notIntProfIdx = sortList.findIndex(({id}) => id === notInterestingId(videoId))
                sortList.splice(notIntProfIdx, 0, currentProf(videoId));
                setSortList(sortList)
                const nextProf = allActiveProf.filter(prof => !sortList.includes(prof))[0]
                if (nextProf) {
                    setActiveProfs([sortList[0], nextProf])
                } else {
                    setInterestingProf(sortList)

                    setIsEnd(!isEnd)
                }
            }
        }
    }

    const onHandleChoose = (videoId) => {

        sortProf(videoId)
    }

    //начать заново
    const onRepeatClick = () => {
        startSet()
        setInterestingProf([])
        setSortList([])
        setIsEnd(!isEnd)

    }

    return (
        <>
            {isEnd
                ? <ResList
                    interestingProf={interestingProf}
                    onRepeatClick={onRepeatClick}
                />
                : <PlayerList
                    title={title}
                    activeProfs={activeProfs}
                    onHandleChoose={onHandleChoose}
                    title_description={title_description}
                    title_sub_description={title_sub_description}
                />
            }
        </>
    );
};

export default Testing;
