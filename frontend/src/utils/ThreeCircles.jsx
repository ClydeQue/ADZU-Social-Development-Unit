// for the three circles background design :)

const ThreeCircles = () => {
  return (
<>
            {/* Small circle loob */}
            <div className="absolute right-120 top-100 w-[50rem] h-[48rem] border-2 border-white rounded-full opacity-20" 
                 style={{ transform: 'translate(50%, -50%)' }}></div>
            {/* Medium circle mid */}
            <div className="absolute right-120 top-100 w-[57rem] h-[55rem] border-2 border-white rounded-full opacity-10" 
                 style={{ transform: 'translate(50%, -50%)' }}></div>
            {/* Large circle outer */}
            <div className="absolute right-120 top-100 w-[62rem] h-[60rem]  border-2 border-white rounded-full opacity-5" 
                 style={{ transform: 'translate(50%, -50%)' }}></div>
</>
  )
}

export default ThreeCircles