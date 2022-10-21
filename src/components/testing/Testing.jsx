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
    const [displayedVideos, setDisplayedVideos] = useState([])
    const [isEnd, setIsEnd] = useState(false)
    const [sortList, setSortList] = useState([])

    useEffect(() => {
        startSet()
    }, [])

    useEffect(() => {
        setDisplayedVideos([...displayedVideos, activeProfs.map(({id}) => id)])
    }, [activeProfs])

    const startSet = () => {
        const startVideo = videos.filter(({id}) => startVideos.includes(id))
        const allProfs = videos.filter(({lvl}) => lvl === 1)
        setAllActiveProf(allProfs)
        setActiveProfs(startVideo)
    }

    const lvlFilter = (prof) => {
        const aboveFirstLvl = prof.filter(({lvl}) => lvl !== 1)
        return aboveFirstLvl.filter(({child}) => child.length === 0)
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
    const notProf = () => {
        const childIds = sortList.map(({child}) => child).flat(1)
        const viewed = displayedVideos.flat(1)
        //проверить child на повторное отображение
        const childIdsDisplayedFilter = childIds.filter(child => !viewed.includes(child))
        const childs = videos.filter(({id}) => childIdsDisplayedFilter.includes(id))
        //вывести на экран
        childs.length > 0 && setActiveProfs([childs[0], childs[1]])
        //запомнить новый список профессий
        setAllActiveProf(childs)

        if (childs.length === 0 || childs.length === 1) {
            //больше нет профессий очистить поля и отрисовать результаты
            setInterestingProf(lvlFilter(sortList))

            setIsEnd(!isEnd)
        }
        const notOneLvl = sortList.filter(({lvl}) => lvl !== 1)
        setSortList(notOneLvl)
    }

    const onHandleChoose = (videoId) => {
        if (sortList.length === 0) {
            sortList.push(currentProf(videoId))
            sortList.push(currentProf(notInterestingId(videoId)))

            setActiveProfs([sortList[0], nextProf(videoId, notInterestingId(videoId))])
            setSortList(sortList)
        } else {
            const isThere = sortList.some(({id}) => id === videoId)
            if (isThere) {
                const currentIdxProf = sortList.findIndex(({id}) => id === videoId)
                if (sortList[currentIdxProf + 1]) {
                    setActiveProfs([sortList[currentIdxProf + 1], currentProf(notInterestingId(videoId))])
                } else {
                    sortList.push(currentProf(notInterestingId(videoId)))
                    setSortList(sortList)
                    const nextProf = allActiveProf.filter(prof => !sortList.includes(prof))[0]
                    if (nextProf) {
                        setActiveProfs([sortList[0], nextProf])
                    } else {
                        notProf()
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
                    notProf()
                }

            }

        }
    }

    //начать заново
    const onRepeatClick = () => {
        startSet()
        setInterestingProf([])
        setDisplayedVideos([])
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
