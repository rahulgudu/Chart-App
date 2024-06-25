
const Message = () => {
  return (
    <div className="chat chat-end">
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://i.pravatar.cc/300" />
            </div>
        </div>
        <div className={`chat-bubble text-white bg-purple-500`}>Hii ! What&apos; upp?? </div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">12:42</div>
    </div>
  )
}

export default Message