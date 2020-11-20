import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import ServerBar from '../components/ServerBarPage/ServerBar/ServerBar';
import MenuBar from '../components/MenuBarPage/MenuBar/MenuBar';
import RoadMapPage from '../components/RoadMapPage/RoadMap';
import MainCreate from '../components/ServerBarPage/CreateServer/MainCreate/MainCreate';
import styles from './pageSame.scss';
import classNames from 'classnames/bind';
import ProjectExit from '../components/MenuBarPage/ProjectExit/ProjectExit';
import Chatting from './../components/ChattingModal/Chatting';
import NotFound from './../components/ServerBarPage/NotFound/NotFound';

const cx = classNames.bind(styles);

function Roadmap() {
  const title = ["로드맵", 3]
  const [menubar, setMenubar] = useState(false);
  const [create, setCreate] = useState(false);
  const [color, setColor] = useState('');
  const [team, setTeam] = useState('');
  const [lists, setLists] = useState([]);
  const [exit, setExit] = useState(false);
  const [exitTrue, setExitTrue] = useState(-1);
  const [mouseMove, setMouseMove] = useState(false);
  const [chatOnline, setChatOnline] = useState(false);
  const [positionY, setPositionY] = useState(0);
  const [serverNot, setServerNot] = useState(false);
  const [addServerN, setAddServerN] = useState(false);

  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    if (typeof (location.state) !== 'undefined' && location.state !== null) {
      const { serverLists } = location.state;
      setLists(serverLists);
      if(serverLists.length > 0) {
        setServerNot(false)
      }
    } else {
      // error handling, if message undefined
      setLists([]);
    }
  }, [])

  useEffect(() => {
    if(lists.length === 0) {
      setServerNot(true)
    } else {
      setServerNot(false)
    }
  }, [lists]);

  const onClickServer = (e) => {
    for (var i = 0; i < lists.length; i++) {
      lists.splice(i, 1, {id: lists[i].id, title: lists[i].title, color: lists[i].color, online: false});
    }
    lists.splice(e.target.innerText-1, 1, {id: e.target.innerText, title: e.target.title, color: e.target.style.backgroundColor, online: true});
    history.push({
      pathname: '/schedule',
      state: {
        serverLists: lists
      }
    });
    setMenubar(false);
  }

  const addServer = () => {
    if (color !== '' && team !== '') {
      setMenubar(false);
      for (var i = 0; i < lists.length; i++) {
        lists.splice(i, 1, {id: lists[i].id, title: lists[i].title, color: lists[i].color, online: false});
      }

      setLists([
        ...lists,
        {id: lists.length + 1, title: team, color: color, online: true}
      ])
      setTeam('');
      setColor('');
      setCreate(false);
      setServerNot(false);
      setAddServerN(true);
    } else {
      alert("색상 또는 팀 이름을 확인해주세요.")
    }
  }

  useEffect(() => {
    if(addServerN === true) {
      history.push({
        pathname: '/schedule',
        state: {
          serverLists: lists
        }
      })
    }
  }, [addServerN])

  const handleProjectExit = () => {
    for(var i=0;i<lists.length;i++) {
      if(lists[i].online === true) {
        setExitTrue(i);
      }
    }

    setExit(false);
  }

  useEffect(() => {
    if(exitTrue !== -1) {
      lists.splice(exitTrue, 1);

      for(var i=0;i<lists.length;i++) {
        lists.splice(i,1,{id: i+1, title: lists[i].title, color: lists[i].color, online: false })
      }

      if(lists.length > 0) {
        lists.splice(exitTrue-1, 1, {id: lists[exitTrue-1].id, title: lists[exitTrue-1].title, color: lists[exitTrue-1].color, online: true});
      }
      
      if(lists.length === 0) {
        setServerNot(true)
      }

      setExitTrue(-1);
      setMenubar(false);
    }
  }, [exitTrue])

  const handleMousePosition = (e) => {
    e.preventDefault();

    if(chatOnline === false) {
      if(e.clientX > 1514) {
        setMouseMove(true);
        setPositionY(e.clientY)
      }else {
        setMouseMove(false);
      }
    }
  }

  return (
    <div onMouseMove={(e) => handleMousePosition(e)}>
      { serverNot === true ?
        <div>
          <NotFound></NotFound>
          <MenuBar title={title[0]} id={title[1]} menubar={menubar} onClick={() => setMenubar(!menubar)} handleExit={() => setExit(true)} serverlists={lists}></MenuBar>
          <Header title={title[0]}></Header>
          <ServerBar lists={lists} createServer={() => setCreate(true)} onClickServer={onClickServer}></ServerBar>
          { create === true &&
            <div>
              <div className={cx('backOpacity')} onClick={() => setCreate(false)}></div>
              <MainCreate color={color} colorChange={(color) => setColor(color.hex)} teamChange={(e) => setTeam(e.target.value)} addServer={addServer}></MainCreate>
            </div>
          }
        </div>
        :
        <div>
          <RoadMapPage menubar={menubar}></RoadMapPage>
          <MenuBar title={title[0]} id={title[1]} menubar={menubar} onClick={() => setMenubar(!menubar)} handleExit={() => setExit(true)} serverlists={lists}></MenuBar>
          <Header title={title[0]}></Header>
          <ServerBar lists={lists} createServer={() => setCreate(true)} onClickServer={onClickServer}></ServerBar>
          <Chatting 
            positionY={positionY}
            mouseMove={mouseMove} 
            handleChattingOn={() => setChatOnline(true)} 
            handleChattingOff={() => {setChatOnline(false);setMouseMove(false);}}
          />
          { create === true &&
            <div>
              <div className={cx('backOpacity')} onClick={() => setCreate(false)}></div>
              <MainCreate color={color} colorChange={(color) => setColor(color.hex)} teamChange={(e) => setTeam(e.target.value)} addServer={addServer}></MainCreate>
            </div>
          }
          { exit === true &&
            <div>
              <div className={cx('backOpacity')}></div>
              <ProjectExit handleProjectExit={handleProjectExit}></ProjectExit>
            </div>
          }
          </div>
          }
    </div>
  );
}

export default Roadmap;