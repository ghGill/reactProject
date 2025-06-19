import { useContext, Suspense, lazy, useState, useRef, useEffect } from 'react'
import { useLocation } from "wouter";
import PageLoader from './components/PageLoader';
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
    const { isUserLoggedIn } = useContext(AuthContext);
    const [pageIsLoading, setPageIsLoading] = useState(true);
    const [route, setRoute] = useState('');

    const [location] = useLocation();

    useEffect(() => {
        setPageIsLoading(true);
    }, [location])

    function pageContent(route='/') {
        const pageIsReady = (() => { 
            setTimeout(() => {
                setPageIsLoading(false);
            }, 1000)
        });
        
        route = route.toLowerCase();

        if (route !== '/signup') {
            if (!isUserLoggedIn())
                route = '/login'
        }

        switch (route) {
            case '/signup':
                return (
                    <LogoLayout>
                        <Signup pageIsReady={ pageIsReady } />
                    </LogoLayout>
                )

            case '/login':
                return (
                    <LogoLayout>
                        <Login pageIsReady={ pageIsReady } />
                    </LogoLayout>
                )

            case '/':
            case '/overview':
                return (
                    <SidebarLayout route={route} title="Overview">
                        <Overview  pageIsReady={ pageIsReady } />
                    </SidebarLayout>
                )

            case '/pots':
                return (
                    <SidebarLayout route={route} title="Pots" >
                        <Pots  pageIsReady={ pageIsReady } />
                    </SidebarLayout>
                )

            case '/transactions':
                return (
                    <SidebarLayout route={route} title="Transactions" >
                        <Transactions  pageIsReady={ pageIsReady }/>
                    </SidebarLayout>
                )

            case '/budgets':
                return (
                    <SidebarLayout route={route} title="Budgets" >
                        <UnderConstruction  pageIsReady={ pageIsReady } />
                    </SidebarLayout>
                )

            case '/recurring-bills':
                return (
                    <SidebarLayout route={route} title="RecurringBills" >
                        <UnderConstruction pageIsReady={ pageIsReady } />
                    </SidebarLayout>
                )
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
                    // new Promise((resolve, reject) => {
                    //     setTimeout(() => {
                    //         resolve(pageContent(location))
                    //     }, 1000)
                    // })
                }
            </Suspense>
        </div>
    )
}

export default Pages
