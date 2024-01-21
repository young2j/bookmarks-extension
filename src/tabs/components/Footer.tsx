const Footer = () => {
  return (
    <footer>
      <button
        className="cursor-pointer flex items-end justify-start h-10 mb-8 w-11/12 max-w-6xl gap-2 mx-auto md:w-10/12 md:justify-end animate-fade-up animate-delay-[1700ms] animate-duration-500 hover:underline hover:underline-offset-1 hover:text-sky-500"
        onClick={() => window.open("https://github.com/young2j", "_blank")}
      >
        <span>Github</span>
        <span>•</span>
        <span>young2j</span>
      </button>
    </footer>
  );
};

export default Footer;
