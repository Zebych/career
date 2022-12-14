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
        if (allActiveProf.length > 0) {
            setActiveProfs([allActiveProf[0], allActiveProf[1]])
        }
    }, [allActiveProf])

    const startSet = () => {
        const allProfs = videos.filter(({lvl}) => lvl === 1)
        setAllActiveProf(allProfs)
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

    const lvlFilter = (prof) => {
        const aboveFirstLvl = prof.filter(({lvl}) => lvl !== 1)
        return aboveFirstLvl.filter(({child}) => child.length === 0)
    }

    //?????????? ?????????? ???????????????????? ????????????
    const notInterestingId = (videoId) => activeProfs.find(({id}) => id !== videoId).id

    //?????????????????? ??????????????????
    const nextProf = (int, notInt) => {
        let sort = allActiveProf.filter((prof) => prof.id !== int)
        const newAllActiveProf = sort.filter((prof) => prof.id !== notInt)
        return newAllActiveProf[middleProfIdx(newAllActiveProf)]
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

    const middleProfIdx = (list) => {
        let halfLength = list.length / 2
        if (halfLength % 2 === 0) {
            return halfLength === 0 ? halfLength : halfLength - 1
        } else {
            return Math.floor(halfLength)
        }
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
        //?????????????????? child ???? ?????????????????? ??????????????????????
        const childIdsDisplayedFilter = childIds.filter(child => !viewed.includes(child))

        const childs = videos.filter(({id}) => childIdsDisplayedFilter.includes(id))
        //?????????????? ???? ??????????
        childs.length > 0 && setActiveProfs([childs[0], childs[1]])
        //?????????????????? ?????????? ???????????? ??????????????????
        setAllActiveProf(childs)

        if (childs.length === 0 || childs.length === 1) {
            //???????????? ?????? ?????????????????? ???????????????? ???????? ?? ???????????????????? ????????????????????
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

            //???????? ?????????????????? ?????????????????? ?????? ???????? ?? ?????????????????????????? ????????????
            if (isThere) {
                const currentIdxProf = sortList.findIndex(({id}) => id === videoId)

                let nextProf = () => {
                    let nextProf
                    if (sortList.some(({lvl}) => lvl === 1)) {

                        nextProf = sortList.length < sortList.length + 1 && sortList[currentIdxProf + 1]
                    } else {
                        const prevCombinations = displayedVideos[displayedVideos.length - 2]
                        const prevProf = prevCombinations.filter(prof => prof !== notInterestingId(videoId))
                        const idxPrevProf = sortList.findIndex(({id}) => id === prevProf[0])
                        let profCompare = sortList.filter((prof, i) => i > currentIdxProf)
                        if (sortList.length > 2 && currentIdxProf < middleProfIdx(sortList)) {
                            profCompare = sortList.filter((prof, i) => i > currentIdxProf && i < idxPrevProf)
                        }
                        nextProf = profCompare[middleProfIdx(profCompare)]
                    }
                    return nextProf
                }
                const displayed = nextProf()
                    ? displayedVideos.map(profs => equalArrays(profs, [nextProf().id, currentProf(notInterestingId(videoId)).id])).includes(true)
                    : true

                if (nextProf() && !displayed) {
                    setActiveProfs([nextProf(), currentProf(notInterestingId(videoId))])
                } else {
                    sortList.splice(currentIdxProf + 1, 0, currentProf(notInterestingId(videoId)));
                    setSortList(sortList)
                    const nextProf = allActiveProf.filter(prof => !sortList.includes(prof))
                    nextProf.length > 0 ? setActiveProfs([middleSortList(), nextProf[middleProfIdx(nextProf)]]) : notProf()
                }
            } else {
                //???????? ?????????????????? ?????????????????? ?????? ?????? ?? ???????????? ????????????????????
                const notIntProfIdx = sortList.findIndex(({id}) => id === notInterestingId(videoId))

                const nextProf = () => {
                    let nextProf
                    if (sortList.some(({lvl}) => lvl === 1)) {
                        nextProf = (notIntProfIdx - 1) >= 0 && sortList[notIntProfIdx - 1]
                    } else {
                        let profCompare = sortList.filter((prof, i) => i < notIntProfIdx)
                        const prevCombinations = displayedVideos[displayedVideos.length - 2]
                        const prevProf = prevCombinations.filter(prof => prof !== videoId)
                        const idxPrevProf = sortList.findIndex(({id}) => id === prevProf[0])

                        if (sortList.length > 2 && notIntProfIdx > middleProfIdx(sortList)) {
                            profCompare = sortList.filter((prof, i) => i < notIntProfIdx && i > idxPrevProf)
                        }

                        nextProf = profCompare[middleProfIdx(profCompare)]
                    }
                    return nextProf
                }

                //???????????????? ???? ?????????????????? ??????????????????
                const displayeds = nextProf()
                    ? displayedVideos.map(profs => equalArrays(profs, [nextProf().id, currentProf(videoId).id])).includes(true)
                    : true

                if (nextProf() && !displayeds) {
                    setActiveProfs([nextProf(), currentProf(videoId)])
                } else {
                    const notIntProfIdx = sortList.findIndex(({id}) => id === notInterestingId(videoId))
                    sortList.splice(notIntProfIdx, 0, currentProf(videoId));

                    setSortList(sortList)
                    const nextProf = allActiveProf.filter(prof => !sortList.includes(prof))
                    !middleSortList() && sortList.push(nextProf[0]) && notProf()
                    nextProf.length > 0 && middleSortList() ? setActiveProfs([middleSortList(), nextProf[middleProfIdx(nextProf)]]) : notProf()
                }
            }
        }
    }

    //???????????? ????????????
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
