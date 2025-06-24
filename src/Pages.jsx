import { Suspense, lazy, useState, useEffect } from 'react'
import { useLocation } from "wouter";
import PageLoader from './components/PageLoader';
import { useAuthContext } from './contexts/AuthContext'

const SidebarLayout = lazy(() => import('./pages/layout/SidebarLayout'))
const LogoLayout = lazy(() => import('./pages/layout/LogoLayout'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Overview = lazy(() => import('./pages/overview/Overview'))
const Pots = lazy(() => import('./pages/pots/Pots'))
const Transactions = lazy(() => import('./pages/transactions/Transactions'))
const UnderConstruction = lazy(() => import('./pages/UnderConstruction'))

function Pages() {
    const { isUserLoggedIn } = useAuthContext();
    const [pageIsLoading, setPageIsLoading] = useState(true);

    const [location] = useLocation();

    useEffect(() => {
        setPageIsLoading(true);
    }, [location])

    const pageIsReady = (() => { 
        setTimeout(() => {
            setPageIsLoading(false);
        }, 1000)
    });

    function LogoPage(Component) {
        return (
            <LogoLayout>
                <Component pageIsReady={ pageIsReady } />
            </LogoLayout>
        )
    }

    function SidebarPage(Component, route, title) {
        return (
            <SidebarLayout route={route} title={title}>
                <Component pageIsReady={ pageIsReady } />
            </SidebarLayout>
        )
    }

    function pageContent(route='/') {
        
        route = route.toLowerCase();

        if (route !== '/signup') {
            if (!isUserLoggedIn())
                route = '/login'
        }

        switch (route) {
            case '/signup':
                return LogoPage(Signup);

            case '/login':
                return LogoPage(Login);

            case '/':
            case '/overview':
                return SidebarPage(Overview, route, "Overview");

            case '/pots':
                return SidebarPage(Pots, route, "Pots");

            case '/transactions':
                return SidebarPage(Transactions, route, "Transactions");

            case '/budgets':
                return SidebarPage(UnderConstruction, route, "Budgets");

            case '/recurring-bills':
                return SidebarPage(UnderConstruction, route, "Recurring Bills");
        }
    }

    return (
        <div>
            {
                pageIsLoading &&
                <PageLoader />                
            }

            <Suspense xfallback={<PageLoader />} >
                { 
                    pageContent(location)
                }
            </Suspense>
        </div>
    )
}

export default Pages
