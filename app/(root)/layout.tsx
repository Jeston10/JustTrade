import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalContainer from "@/components/ConditionalContainer";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

const Layout = async ({ children }: { children : React.ReactNode }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if(!session?.user) redirect('/sign-in');

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    }

    return (
        <main className="min-h-screen text-gray-400">
            <ConditionalHeader user={user} />

            <ConditionalContainer>
                {children}
            </ConditionalContainer>
        </main>
    )
}
export default Layout
