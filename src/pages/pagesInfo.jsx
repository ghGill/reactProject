import Budgets from '../pages/Budgets.jsx'
import Overview from './Overview.jsx'
import Pots from './Pots.jsx'
import RecurringBills from './RecurringBills.jsx'
import Transactions from './Transactions.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'

export const pagesInfoData = {
    sidebar_title: "finance",
    pages: [
        {
            id:"signup",
            type:"logo",
            component: Signup,
            default:false,
        },
        {
            id:"login",
            type:"logo",
            component: Login,
            default:false,
        },
        {
            id:"overview",
            type:"sidebar",
            title:"Overview",
            icon:"home",
            component: Overview,
            default:true,
        },
        {
            id:"transactions",
            type:"sidebar",
            title:"Transactions",
            icon:"exchange",
            component: Transactions,
            default:false,
        },
        {
            id:"budgets",
            type:"sidebar",
            title:"Budgets",
            icon:"pie-chart",
            component: Budgets,
            default:false,
        },
        {
            id:"pots",
            type:"sidebar",
            title:"Pots",
            icon:"money",
            component: Pots,
            default:false,
        },
        {
            id:"recurring-bills",
            type:"sidebar",
            title:"Recurring Bills",
            icon:"file-text-o",
            component: RecurringBills,
            default:false,
        },
    ]
}

export function getDefaultPageData(key=false) {
    const data = pagesInfoData.pages.filter(info => info.default === true);

    if (!key)
        return data[0]
    else
        return data[0][key];
}

export function getPageDataById(id) {
    const data = pagesInfoData.pages.filter(info => info.id === id);

    return data[0];
}

