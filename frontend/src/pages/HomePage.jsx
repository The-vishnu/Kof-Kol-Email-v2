import React from 'react'
import ChatSection from '../components/ChatSection'
import Sidebar from '../components/Sidebar'
import NoChatSelected from '../components/noChatSelected'
import { useChatStore } from '../store/useChatStore'

const HomePage = () => {
    const { selectedFriend } = useChatStore();
    console.log(selectedFriend)
  return (
    <>
      <Sidebar />
      {selectedFriend ? <ChatSection selectedFriend={selectedFriend} /> : <NoChatSelected />}
    </>
  )
}

export default HomePage
