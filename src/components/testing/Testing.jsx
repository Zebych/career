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
    const [notInterestingProf, setNotInterestingProf] = useState([])
    const [displayedVideos, setDisplayedVideos] = useState([])
    const [isEnd, setIsEnd] = useState(false)

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

    const onHandleChoose = (videoId, lvl) => {
        const notInteresting = activeProfs.find(({id}) => id !== videoId)
        const notInterestingVideos = [...notInterestingProf, notInteresting]
        setNotInterestingProf(notInterestingVideos)

        let sort = allActiveProf.filter((prof) => prof.id !== videoId)
        sort = sort.filter((prof) => prof.id !== notInteresting.id)
        setAllActiveProf(sort)

        const interestingVideo = videos.find(({id}) => id === videoId)
        const interestingVideos = [...interestingProf, interestingVideo]
        setInterestingProf(interestingVideos)

        if (sort.length >= 2) {
            setActiveProfs([sort[0], sort[1]])
        }
        if (sort.length < 2) {
            const childIds = interestingVideos.map(({child}) => child).flat(1)
            const viewed = displayedVideos.flat(1)
            const childIdsDisplayedFilter = childIds.filter(child => !viewed.includes(child))

            const childs = videos.filter(({id}) => childIdsDisplayedFilter.includes(id))
            childs.length > 0 && setActiveProfs([childs[0], childs[1]])
            setAllActiveProf(childs)

            if (childs.length === 0 || childs.length === 1) {
                setInterestingProf(lvlFilter(interestingVideos))
                setNotInterestingProf(lvlFilter(notInterestingVideos))
                setIsEnd(!isEnd)
            }
        }
    }

    const onRepeatClick = () => {
        startSet()
        setInterestingProf([])
        setDisplayedVideos([])
        setNotInterestingProf([])
        setIsEnd(!isEnd)

    }

    return (
        <>
            {isEnd
                ? <ResList
                    interestingProf={interestingProf}
                    notInterestingProf={notInterestingProf}
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
