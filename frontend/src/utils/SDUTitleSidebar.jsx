const SDUTitleSidebar = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1
        className="text-[#1E22AA] leading-none font-inter text-[5rem] font-black flex items-end"
        style={{ letterSpacing: "-0.15rem" }}
      >
        <span>SD</span>
        <span
          className="font-extrabold text-[4rem] ml-0.5 font-poppins italic tracking-widest text-transparent"
          style={{ WebkitTextStroke: "1px #1E22AA" }}
        >
          u
        </span>
      </h1>
      <h5 className="font-inter uppercase text-[#1E22AA] font-extrabold pt-1 text-[0.65rem] text-center whitespace-nowrap">
        Social Development Unit
      </h5>
    </div>
  );
};

export default SDUTitleSidebar;
