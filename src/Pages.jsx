import { useContext, Suspense, lazy } from 'react'
import { useLocation } from "wouter";
import Spinner from './components/Spinner';
import { AuthContext } from './contexts/AuthContext'

const lazyComponent = ((componentPath) => 
    lazy(() => import(componentPath)
))

// const lazyComponent = ((componentPath) => 
//     lazy(() => {
//         return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                 resolve(import(componentPath))
//             }, 2000)
//         })  
//     })
// )

const SidebarLayout = lazyComponent('./pages/layout/SidebarLayout')
const LogoLayout = lazyComponent('./pages/layout/LogoLayout')
const Login = lazyComponent('./pages/Login')
const Signup = lazyComponent('./pages/Signup')
const Overview = lazyComponent('./pages/overview/Overview')
const Pots = lazyComponent('./pages/pots/Pots')
const Transactions = lazyComponent('./pages/transactions/Transactions')
const UnderConstruction = lazyComponent('./pages/UnderConstruction')

function Pages() {
    const context = useContext(AuthContext);
    const [location] = useLocation();

    function pageContent(route='/') {
        route = route.toLowerCase();

        if (route !== '/signup') {
            if (!context.user) {
                route = '/login'
            }
        }

        switch (route) {
            case '/signup':
                return (
                    <LogoLayout >
                        <Signup />
                    </LogoLayout>
                )

            case '/login':
                return (
                    <LogoLayout >
                        <Login />
                    </LogoLayout>
                )

            case '/':
            case '/overview':
                return (
                    <SidebarLayout route={route} title="Overview">
                        <Overview />
                    </SidebarLayout>
                )

            case '/pots':
                return (
                    <SidebarLayout route={route} title="Pots">
                        <Pots />
                    </SidebarLayout>
                )

            case '/transactions':
                return (
                    <SidebarLayout route={route} title="Transactions">
                        <Transactions />
                    </SidebarLayout>
                )

            case '/budgets':
                return (
                    <SidebarLayout route={route} title="Budgets">
                        <UnderConstruction />
                    </SidebarLayout>
                )

            case '/recurring-bills':
                return (
                    <SidebarLayout route={route} title="RecurringBills">
                        <UnderConstruction />
                    </SidebarLayout>
                )

        }
    }

    return (
        <>
            <Suspense fallback={<Spinner />} >
                { pageContent(location) }
            </Suspense>
        </>
    )
}

export default Pages
