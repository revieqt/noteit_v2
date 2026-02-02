import Image from "next/image";

export default function Home() {
  return (
    <div className='bg-zinc-100'>
      <header id="headerPattern" className="sticky top-0 z-50">
        <div className="mx-auto pt-20 pb-20 max-w-6xl px-6 flex flex-col items-center justify-center h-full">
          <a href="/" className="text-4xl font-bold text-white">NoteIt</a>
          <p className="text-l text-slate-100">Your Personal Note Taking App</p>
          <div className="mt-2 flex space-x-2">
            <a href="/create" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-full text-sm px-4 py-3 text-center leading-5 inline-block">Create New Note</a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full">
        <div className="max-w-4xl mx-auto">
          <div className="absolute w-full max-w-4xl bg-white rounded-lg shadow-lg z-50 top-[240px] p-5 ">
            <div className="w-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <button 
                  type="button"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium transition hover:bg-slate-50 hover:border-indigo-500 hover:text-indigo-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  Favorites
                </button>
              </div>

              <div>
                <div className="p-3 rounded-lg max-h-40 overflow-hidden">
                  <h2 className="text-lg font-semibold">tITLE IRIDS</h2>
                  <p className="text-slate-600 mt-1 text-sm">
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                    This is a sample note content preview. Click to view more details.
                  </p>
                  <div className="bg-gradient-to-b from-transparent to-white absolute bottom-0 left-0 right-0 h-[150px] z-50 flex items-end justify-end p-6 gap-2">
                    <button 
                      type="button"
                      className="px-4 py-2 rounded-full bg-red-500 text-white font-medium transition hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                    <button 
                      type="button"
                      className="px-4 py-2 rounded-full bg-yellow-500 text-white font-medium transition hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      type="button"
                      className="px-4 py-2 rounded-full bg-green-500 text-white font-medium transition hover:bg-green-600 text-sm"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
