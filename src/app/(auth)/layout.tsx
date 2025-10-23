
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex bg-muted min-h-svh  items-center flex-col justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium" >
                    <Image src="/logo.svg" alt="Nodebase" width={30} height={30} /> Nodebase
                </Link>
                {children}
            </div>
        </div>
    )
}

export default Layout