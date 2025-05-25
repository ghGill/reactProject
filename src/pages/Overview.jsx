import { useEffect, useState } from 'react'
import './Overview.css'
import chart from '../assets/budgets-chart.png'

function Overview({ changePageHandler }) {
    const [users, setUsers] = useState([]);

    const dbUrl = "https://raw.githubusercontent.com/ghGill/reactProjectDB/refs/heads/main/";

    function loadUsers() {
        fetch(`${dbUrl}users.json`)
            .then(async res => {
                const data = await res.json();
                setUsers(data);
            })
    }

    useEffect(() => {
        loadUsers();
    }, [])

    function Card({ active, title, amount }) {
        return (
            <div className={`section card ${active === "true" ? "active" : ""}`}>
                <div>{title}</div>
                <div className='amount'>{amount}</div>
            </div>
        )
    }

    function PotsCard({title, amount, colorClass}) {
        return (
            <div className='pots-card'>
                <div className={`color ${colorClass}`}></div>
                <div className='info'>
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
                    <img src={`${dbUrl}${userData.image}`} alt="" />
                    <div className='user-name'>{`${userData.firstname} ${userData.lastname}`}</div>
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
            <div className='budget-card'>
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
            <div className={`bills-card ${color}`}>
                <div>{title}</div>
                <div className='amount'>{amount}</div>
            </div>
        )
    }

    return (
        <>
            <div className='overview-page'>
                <div className='header'>
                    <div className="title">Overview</div>
                </div>
                
                <div className="cards">
                    <Card active="true" title="Current Balance" amount="$4,836.60" />
                    <Card active="false"  title="Income" amount="$3,814.25"/>
                    <Card active = "false"  title="Expenses" amount="$1,700.50" />
                </div>

                <div className='content'>
                    <div className='left'>
                        <div className='section pots'>
                            <div className='header'>
                                <div className="title">Pots</div>
                                <div onClick={() => {changePageHandler('pots')}} className="see-details">See Details <i className="fa fa-play"></i></div>
                            </div>

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

                                <div className='info'>
                                    <PotsCard title='Savings' amount='$159' colorClass='color1' />
                                    <PotsCard title='Gift' amount='$40' colorClass='color2' />
                                    <PotsCard title='Concert Ticket' amount='$110' colorClass='color3' />
                                    <PotsCard title='New Laptop' amount='$10' colorClass='color4' />
                                </div>
                            </div>
                        </div>

                        <div className='section transactions'>
                            <div className='header'>
                                <div className="title">Transactions</div>
                                <div onClick={() => {changePageHandler('transactions')}} className="viewall">View All <i className="fa fa-play"></i></div>
                            </div>

                            <div className='users-list'>
                                {
                                    users.map((user) => {
                                        return <TransactionUser key={user.id} userData={user} />
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="right">
                        <div className='section budgets'>
                            <div className='header'>
                                <div className="title">Budgets</div>
                                <div onClick={() => {changePageHandler('budgets')}} className="see-details">See Details <i className="fa fa-play"></i></div>
                            </div>
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
                        </div>

                        <div className='section bills'>
                            <div className='header'>
                                <div className="title">Recurring Bills</div>
                                <div onClick={() => {changePageHandler('recurring-bills')}} className="see-details">See Details <i className="fa fa-play"></i></div>
                            </div>

                            <div className='cards'>
                                <BillsCard title='Paid Bills' amount='$190.00' color='color1' />
                                <BillsCard title='Total Upcoming' amount='$194.98' color='color2' />
                                <BillsCard title='Due Soon' amount='$59.98' color='color3' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Overview
