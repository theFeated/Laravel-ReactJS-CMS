export default function Navbar({ children }) {
  return (
    // start navbar
    <div className="md:fixed md:w-full md:top-0 md:z-20 flex flex-row flex-wrap items-center bg-white p-6 border-b border-gray-300">
    
        {/* logo and user icon in one row */}
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center">
            <img src="cms/img/logo.png" className="w-10" alt="Logo" />
            <strong className="capitalize ml-1">cleopatra</strong>
          </div>
          
          <div className="flex flex-row items-center">
            <button id="sliderBtn" className="text-gray-900 hidden md:block mr-4">
              <i className="fad fa-list-ul"></i>
            </button>
            
            <div className="dropdown relative">
              <button className="menu-btn focus:outline-none focus:shadow-outline flex items-center">
                <div className="w-8 h-8 overflow-hidden rounded-full">
                  <img className="w-full h-full object-cover" src="cms/img/user.svg" alt="User" />
                </div>
                <div className="ml-2 capitalize flex">
                  <h1 className="text-sm text-gray-800 font-semibold m-0 p-0 leading-none">moeSaid</h1>
                  <i className="fad fa-chevron-down ml-2 text-xs leading-none"></i>
                </div>
              </button>
              <button className="hidden fixed top-0 left-0 z-10 w-full h-full menu-overflow"></button>
              <div className="text-gray-500 menu hidden md:mt-10 md:w-full rounded bg-white shadow-md absolute z-20 right-0 w-40 mt-5 py-2 animated faster">
                {/* item */}
                <a className="px-4 py-2 block capitalize font-medium text-sm tracking-wide bg-white hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 ease-in-out" href="/profile">
                  <i className="fas fa-user-edit text-xs mr-1"></i>
                  Edit Profile
                </a>
                {/* end item */}
                <hr />
                {/* item */}
                <a className="px-4 py-2 block capitalize font-medium text-sm tracking-wide bg-white hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 ease-in-out" href="#">
                  <i className="fad fa-user-times text-xs mr-1"></i>
                  Log Out
                </a>
                {/* end item */}
              </div>
            </div>
          </div>
        </div>
        {/* end logo and user icon in one row */}
    
      </div>
    // end navbar
    
  );
}