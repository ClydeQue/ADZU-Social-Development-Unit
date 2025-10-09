const ThreeCirclesUpperLeft = () => {
  return (

<>
            {/* Small circle loob */}
            <div className="absolute right-34 top-10 w-[32rem] h-[30rem] border-2 border-white rounded-full opacity-20" 
                 style={{ transform: 'translate(50%, -50%)' }}></div>
            {/* Medium circle mid */}
            <div className="absolute right-34 top-10 w-[36rem] h-[34rem] border-2 border-white rounded-full opacity-10" 
                 style={{ transform: 'translate(50%, -50%)' }}></div>
            {/* Large circle outer */}
            <div className="absolute right-34 top-10 w-[40rem] h-[38rem]  border-2 border-white rounded-full opacity-5" 
                 style={{ transform: 'translate(50%, -50%)' }}></div>
</>
  )
}

export default ThreeCirclesUpperLeft
