import React from "react"

const Layout: React.FC = ({ children }) => {
    return (
        <div className="flex items-center flex-col min-h-screen font-mono">
            <header className="w-screen border-b-2">
                <div className="w-11/12 xl:w-8/12 m-auto py-16 flex">
                    <h1 className="text-5xl">WordCloud Visualizer</h1>
                </div>
            </header>
            <main className="flex flex-1 items-center flex-col w-9/12">
                {children}
            </main>
            <footer className="w-full h-12 flex justify-center items-center bg-green-400 mt-8">
                <span>© Masahiro Matsumoto</span>
            </footer>
        </div>
    )
}

export default Layout
