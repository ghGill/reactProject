import { useContext, Suspense, lazy } from 'react'
import { useLocation } from "wouter";
import Spinner from './components/Spinner';
import { AuthContext } from './contexts/AuthContext'

const SidebarLayout = lazy(() => import('./pages/layout/SidebarLayout'))
const LogoLayout = lazy(() => import('./pages/layout/LogoLayout'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Overview = lazy(() => import('./pages/overview/Overview'))
const Pots = lazy(() => import('./pages/pots/Pots'))
const Transactions = lazy(() => import('./pages/transactions/Transactions'))
const UnderConstruction = lazy(() => import('./pages/UnderConstruction'))

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
                { 
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(pageContent(location))
                        }, 2000)
                    })
                }
            </Suspense>
        </>
    )
}

export default Pages
