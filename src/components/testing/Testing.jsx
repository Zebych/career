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
    } = data

    const [activeProfs, setActiveProfs] = useState([])
    const [allActiveProf, setAllActiveProf] = useState([])
    const [interestingProf, setInterestingProf] = useState([])
    const [displayedVideos, setDisplayedVideos] = useState([])
    const [sortList, setSortList] = useState([])
    const [isEnd, setIsEnd] = useState(false)

    useEffect(() => {
        startSet()
    }, [])

    useEffect(() => {
        setDisplayedVideos([...displayedVideos, activeProfs.map(({id}) => id)])
    }, [activeProfs])

    useEffect(() => {
        middleAllActiveProf()
    }, [allActiveProf])

    const middleAllActiveProf = () => {
        if (allActiveProf.length > 2) {
            let halfLength = allActiveProf.length / 2

            if (halfLength % 2 === 0) {
                const startVideo = allActiveProf[halfLength - 1]
                setActiveProfs([startVideo, allActiveProf[halfLength]])
            } else {
                const startVideo = allActiveProf[Math.floor(halfLength)]
                const follow = allActiveProf[Math.floor(halfLength) + 1]
                setActiveProfs([startVideo, follow])
            }
        }
    }

    const middleSortList = () => {
        if (sortList.length >= 2) {
            let halfLength = sortList.length / 2
            if (halfLength % 2 === 0) {
                return sortList[halfLength - 1]
            } else {
                return sortList[Math.floor(halfLength)]
            }
        }
    }

    const startSet = () => {
        const allProfs = videos.filter(({lvl}) => lvl === 1)
        setAllActiveProf(allProfs)
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

    const equalArrays = (a, b) => {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++)
            if (a[i] !== b[i]) return false;
        return true;
    }

    const notProf = () => {
        let cut
        if ((sortList[0].lvl === 1 || sortList[0].lvl === 2) && sortList.length > 2) {
            console.log('sortList:', sortList)
            let halfLength = sortList.length / 2
            cut = sortList.slice(0, halfLength % 2 === 0 ? halfLength : Math.ceil(halfLength))
            setSortList(sortList)
        }
        const childIds = cut ? cut.map(({child}) => child).flat() : sortList.map(({child}) => child).flat()

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
        if (sortList.length === 0 && nextProf(videoId, notInterestingId(videoId))) {
            sortList.push(currentProf(videoId))
            sortList.push(currentProf(notInterestingId(videoId)))

            setActiveProfs([sortList[0], nextProf(videoId, notInterestingId(videoId))])
            setSortList(sortList)
        } else {
            const isThere = sortList.some(({id}) => id === videoId)

            //если выбранная профессия уже есть в сортированном списке
            if (isThere) {
                const currentIdxProf = sortList.findIndex(({id}) => id === videoId)
                const nextProf = sortList.length < sortList.length + 1 && sortList[currentIdxProf + 1]

                if (nextProf) {
                    //проверка на повторную отрисовку
                    const displayed = displayedVideos.map(profs => equalArrays(profs, [nextProf.id, currentProf(notInterestingId(videoId)).id])).includes(true)
                    if (!displayed) {
                        setActiveProfs([nextProf, currentProf(notInterestingId(videoId))])
                    } else {
                        sortList.splice(currentIdxProf + 1, 0, currentProf(notInterestingId(videoId)));
                        setSortList(sortList)
                        const nextAllProf = allActiveProf.filter(prof => !sortList.includes(prof))[0]
                        nextAllProf ? setActiveProfs([middleSortList(), nextAllProf]) : notProf()
                    }

                } else {
                    sortList.push(currentProf(notInterestingId(videoId)))
                    setSortList(sortList)

                    const nextProf = allActiveProf.filter(prof => !sortList.includes(prof))[0]
                    nextProf ? setActiveProfs([middleSortList(), nextProf]) : notProf()
                }
            } else {
                //если выбранной профессии еще нет в списке сортировки
                const notIntProfIdx = sortList.findIndex(({id}) => id === notInterestingId(videoId))
                const nextProf = (notIntProfIdx - 1) >= 0 && sortList[notIntProfIdx - 1]
                //проверка на повторную отрисовку
                const displayeds = displayedVideos.map(profs => equalArrays(profs, [nextProf.id, currentProf(videoId).id])).includes(true)

                if (nextProf && !displayeds) {
                    setActiveProfs([nextProf, currentProf(videoId)])
                } else {
                    const notIntProfIdx = sortList.findIndex(({id}) => id === notInterestingId(videoId))
                    sortList.splice(notIntProfIdx, 0, currentProf(videoId));
                    setSortList(sortList)
                    const nextProf = allActiveProf.filter(prof => !sortList.includes(prof))[0]
                    !middleSortList() && sortList.push(nextProf) && notProf()
                    nextProf && middleSortList() ? setActiveProfs([middleSortList(), nextProf]) : notProf()
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
