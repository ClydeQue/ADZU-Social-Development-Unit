const SDUTitleSidebar = () => {
  return (
    <>
      {/* utility class lang for sidebar dupe ng sdutitle */}
      <div className="flex flex-col items-center justify-center">
        <h1
          className="text-[#1E22AA] leading-none font-inter text-[5rem] font-black"
          style={{ letterSpacing: "-0.25rem" }}
        >
        <span>SD</span>
        <span
          className="font-extrabold text-[4.0rem] ml-0.5 font-poppins italic tracking-widest text-transparent"
          style={{ WebkitTextStroke: "1px #1E22AA" }}
        >
          u
        </span>
      </h1>
      <div>
        <h5 className="font-inter uppercase text-[#1E22AA] font-extrabold pt-2 sm:text-[0.5rem] lg:text-[0.775rem] xl:text-[0.875rem]">Social Development Unit</h5>
      </div>
    </div>
  
    
    </>
  );
};

export default SDUTitleSidebar;
