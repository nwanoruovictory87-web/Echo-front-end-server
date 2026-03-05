function TopBar() {
  return (
    <div className="flex bg-white">
      <span className="ml-5 mt-5 mr-auto">
        <h3 className="font-mono text-[16px]">Hello</h3>
        <h2 className="font-bold text-lg">Victory</h2>
      </span>
      <span className="mt-7 mr-5">
        <span className="inline-block border-2 border-slate-500 p-2 pt-3 rounded-full mr-1">
          <i className="fa fa-search text-blue-300 text-2xl"></i>
        </span>
        <span className="inline-block border-2 border-slate-500 p-2 pt-3 rounded-full mr-1">
          <i className="fas fa-ellipsis-v  text-blue-300 text-2xl"></i>
        </span>
      </span>
    </div>
  );
}
export default TopBar;
