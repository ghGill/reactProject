import { useContext } from 'react'
import { useLocation } from "wouter";

import SidebarLayout from './pages/layout/SidebarLayout'
import LogoLayout from './pages/layout/LogoLayout'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Overview from './pages/Overview'
import Pots from './pages/Pots';
import Transactions from './pages/Transactions';
import RecurringBills from './pages/RecurringBills';
import Budgets from './pages/Budgets';

import { AuthContext } from './contexts/AuthContext'
import { MediaResolution } from './contexts/MediaResolution';

function Pages() {
    const mediaResolution = useContext(MediaResolution);
    const context = useContext(AuthContext);
    const [location] = useLocation();

    function pageContent(route='/') {
        route = route.toLowerCase();

        // if (route !== '/signup') {
        //     if (!context.user) {
        //         route = '/login'
        //     }
        // }

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
                    <SidebarLayout route={route}>
                        <Overview />
                    </SidebarLayout>
                )

            case '/pots':
                return (
                    <SidebarLayout route={route}>
                        <Pots />
                    </SidebarLayout>
                )

            case '/transactions':
                return (
                    <SidebarLayout route={route}>
                        <Transactions />
                    </SidebarLayout>
                )

            case '/budgets':
                return (
                    <SidebarLayout route={route}>
                        <Budgets />
                    </SidebarLayout>
                )

            case '/recurring-bills':
                return (
                    <SidebarLayout route={route}>
                        <RecurringBills />
                    </SidebarLayout>
                )

        }
    }

    return (
        <>
            { pageContent(location) }
        </>
    )
}

export default Pages
