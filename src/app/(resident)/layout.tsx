export default function ResidentLayout({children}:{children:React.ReactNode}){
    return(
        <div className="flex min-h-screen bg-gray-50 font-sans antialiased">

            <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shadow-2xl transition-all">

                <div className="p-6">
                    <h2 className="text-xl font-black tracking-widest text-white uppercase border-b border-slate-800 pb-4">
                        Resident<span className="text-indigo-400">.</span>
                    </h2>
                </div>

                <nav className="flex-1 px-3 mt-2">
                    <ul className="space-y-1">
                        {[
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Subscriptions', href: '/subscriptions' },
                            { name: 'Pay Now', href: '/pay-now' },
                            { name: 'Profile', href: '/profile' },
                        ].map((link) => (
                            <li key={link.name}>
                                <a 
                                    href={link.href} 
                                    className="block px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-800 hover:text-white hover:pl-6 group"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

            </aside>

            <main className="flex-1 p-10">
                <div className="h-full rounded-xl">
                    {children}
                </div>
            </main>

        </div>
    )
}