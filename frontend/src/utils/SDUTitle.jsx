import PropTypes from 'prop-types';

const SDUTitle = ({ className = "", style = {} }) => {
  return (
    <div 
      className={`mb-8 md:mt-25 lg:mt-0 ${className}`}
      style={style}
    >
      <h1 
        className="text-white leading-none font-inter text-[10rem] font-black 
           lg:text-[14rem] xl:text-[15rem] 2xl:text-[14rem]"
        style={{ letterSpacing: "-0.5rem" }}
      >
        <span>SD</span>
        <span
          className="font-extrabold text-[8rem] ml-3 font-poppins italic tracking-widest text-transparent
          lg:text-[9.5rem] xl:text-[11rem] 2xl:text-[10.5rem]"
          style={{ WebkitTextStroke: "3px white" }}
        >
          u
        </span>
      </h1>
    </div>
  );
};

SDUTitle.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SDUTitle;