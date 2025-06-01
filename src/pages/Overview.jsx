import { useContext, useEffect, useState } from 'react'
import './Overview.css'
import chart from '../assets/budgets-chart.png'
import {Link} from 'wouter'
import { DB } from '../utils/DB'
import { MediaResolution } from '../contexts/MediaResolution'

function Overview({ changePageHandler }) {
    const [users, setUsers] = useState([]);
    const { isDesktop, isTablet, isMobile } = useContext(MediaResolution);

    useEffect(() => {
        setUsers(DB.usersTable);
    }, [])

    function Card({ active, title, amount }) {
        return (
            <div className={`card ${active === "true" ? "active" : ""} ${isMobile ? 'mobile' : ''}`}>
                <div>{title}</div>
                <div className='amount'>{amount}</div>
            </div>
        )
    }

    function PotsCard({title, amount, colorClass}) {
        return (
            <div className='ticket'>
                <div className={`color ${colorClass}`}></div>
                <div className='details'>
                    <div className='caption'>{title}</div>
                    <div className='amount'>{amount}</div>
                </div>
            </div>
        )
    }

    function TransactionUser({userData}) {
        const amountSign = userData.amount > 0 ? '+' : '-'; 
        
        return (
            <div className='transaction-user'>
                <div className='left'>
                    <img src={DB.imageUrl(userData.image)} alt="" />
                    <div className='user-name'>{userData.name}</div>
                </div>
                <div className='right'>
                    <div className={`amount ${userData.amount >= 0 ? 'amount-plus-color' : 'amount-minus-color'}`}>{amountSign}${Math.abs(userData.amount)}</div>
                    <div className='date'>{userData.date}</div>
                </div>
            </div>
        )
    }

    function BudgetCard({title, amount, color}) {
        return (
            <div className='ticket'>
                <div className={`color ${color}`}>
                </div>
                <div className='details'>
                    <div className='title'>{title}</div>
                    <div className='amount'>{amount}</div>
                </div>
            </div>
        )
    }

    function BillsCard({title, amount, color}) {
        return (
            <div className={`info-card ${color}`}>
                <div>{title}</div>
                <div className='amount'>{amount}</div>
            </div>
        )
    }

    function OverviewCard({ id, w='100%', h='auto', title, linkText, route, children }) {
        return (
            <div className={`${id} overview-card`} style={{ width: w, height: h }}>
                <div className='header'>
                    <div className="title">{title}</div>
                    <Link href={route} className="route">{linkText}<i className="fa fa-play"></i></Link>
                </div>

                {children}
            </div>
        )
    }

    return (
        <div className='overview-page'>
            <div className='page-header'>
                <div className="title">Overview</div>
            </div>
            
            <div className={`top-cards ${isMobile ? 'mobile' : ''}`}>
                <Card active="true" title="Current Balance" amount="$4,836.60" />
                <Card active="false"  title="Income" amount="$3,814.25"/>
                <Card active = "false"  title="Expenses" amount="$1,700.50" />
            </div>

            <div className={`content ${!isDesktop ? 'portrait' : ''}`}>
                <div className={`left ${!isDesktop ? 'portrait' : ''}`}>
                    <OverviewCard id='pots' title='Pots' linkText='See Details' route='/pots' >
                        <div className='data'>
                            <div className="total-saved">
                                <div className='icon'>
                                    <i className='fa fa-money'></i>
                                </div>
                                <div className='info'>
                                    <div className='title'>Total Saved</div>
                                    <div className='value'>$850</div>
                                </div>
                            </div>

                            <div className='categories'>
                                <PotsCard title='Savings' amount='$159' colorClass='color1' />
                                <PotsCard title='Gift' amount='$40' colorClass='color2' />
                                <PotsCard title='Concert Ticket' amount='$110' colorClass='color3' />
                                <PotsCard title='New Laptop' amount='$10' colorClass='color4' />
                            </div>
                        </div>
                    </OverviewCard>

                    <OverviewCard id='transactions' title='Transactions' linkText='View All' route='/transactions' >
                        <div className='users-list'>
                            {
                                users.map((user) => {
                                    return (
                                        <TransactionUser key={user.id} userData={user} />
                                    )
                                })
                            }
                        </div>
                    </OverviewCard>
                </div>

                <div className="right">
                    <OverviewCard id='budgets' title='Budgets' linkText='See Details' route='/budgets' >
                        <div className='data'>
                            <div className="chart">
                                <img src={chart}></img>
                                <div className='info'>
                                    <div className='amount'>$338</div>
                                    <div>of $975 limit</div>
                                </div>
                            </div>
                            <div className="info">
                                <BudgetCard title='Entertainment' amount='$50' color='color1' />
                                <BudgetCard title='Bills' amount='$740.00' color='color2' />
                                <BudgetCard title='Dining Out' amount='$75.00' color='color3' />
                                <BudgetCard title='Personal Care' amount='$100.00' color='color4' />
                            </div>
                        </div>
                    </OverviewCard>

                    <OverviewCard id='bills' title='Recurring Bills' linkText='See Details' route='/recurring-bills' >
                        <div className='cards'>
                            <BillsCard title='Paid Bills' amount='$190.00' color='color1' />
                            <BillsCard title='Total Upcoming' amount='$194.98' color='color2' />
                            <BillsCard title='Due Soon' amount='$59.98' color='color3' />
                        </div>
                    </OverviewCard>
                </div>
            </div>

            <div className='bottom-gap'></div>
        </div>
    )
}

export default Overview
