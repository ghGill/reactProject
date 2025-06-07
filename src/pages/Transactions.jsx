import { useState, useEffect, useContext } from 'react';
import './Transactions.css'
import { DB } from '../utils/DB';
import { MediaResolution } from '../contexts/MediaResolution';
import Modal from '../components/Modal';
import CustomInput from '../components/CustomInput';
import { CustomSelect, CustomIconSelect } from '../components/CustomSelect';
import { CustomButton, CustomIconButton } from '../components/CustomButton';

function TableRow({ data, resolution }) {
    let amount = `${data.amount > 0 ? '+' : '-'}$${parseFloat(Math.abs(data.amount)).toFixed(2)}`;

    return (resolution === 'mobile') ?
    (
        <tr>
            <td>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div className='image-name-container'>
                                <img src={DB.imageUrl(data.image)} alt="" className={resolution} />
                                <b><p>{data.name}</p></b>
                            </div>
                        </td>
                        <td>{data.category}</td>
                    </tr>
                    <tr>
                        <td>{data.date}</td>
                        <td className={`amount ${data.amount > 0 ? 'plus' : ''}`}>{amount}</td>
                    </tr>
                </tbody>
            </table>
            </td>
        </tr>        
    ) :
    (
        <tr>
            <td>
                <div className='image-name-container'>
                    <img src={DB.imageUrl(data.image)} alt="" className={resolution} />
                    <b><p>{data.name}</p></b>
                </div>
            </td>
            <td>{data.category}</td>
            <td>{data.date}</td>
            <td className={`amount ${data.amount > 0 ? 'plus' : ''}`}>{amount}</td>
        </tr>        
    )
}

function Transactions() {
    const sortByOptions = [
        {
            "text":'Latest',
            "value":1
        },
        {
            "text":'Oldest',
            "value":2
        },
        {
            "text":'A to Z',
            "value":3
        },
        {
            "text":'Z to A',
            "value":4
        },
        {
            "text":'Highest',
            "value":5
        },
        {
            "text":'Lowest',
            "value":6
        }
    ];
    
    const categories = DB.getTable('categories');
    const allOption = {"value":999, "text": "All Transactions"};
    const categoryOptions = [allOption, ...categories.map(cat => { return {"value": cat.id, "text":cat.name}})];

    const [allTransactions, setAllTransactions] = useState([]);
    const [viewTransactions, setViewTransactions] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const [sortKey, setSortKey] = useState('');
    const [categoryKey, setCategoryKey] = useState('');
    const [searchText, setSearchText] = useState('');
    
    const { isDesktop, isMobile } = useContext(MediaResolution);
    const resolution = isDesktop ? 'desktop' : 'mobile';

    useEffect(() => {
        const transactionsTable = DB.getTable('transactions');

        const dataTable = transactionsTable.map(tran => {
            return addTransactionExtraData(tran)
        })
        
        setAllTransactions(dataTable);
        setViewTransactions(dataTable);

        setSortKey(sortByOptions[0].value);
        setCategoryKey(categoryOptions[0].value);
    }, [])

    function addTransactionExtraData(data) {
        return {
            ...DB.getUsersJson()[data.user_id],
            ...data, 
            "timestamp":new Date(data.date).getTime(),
            "date":new Date(new Date(data.date).getTime()).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}),
            "category": DB.getCategoriesJson()[data.category_id].name
        }
    }

    // ========================== SEARCH ======================================
    
    // function searchOnChange(event) {
    //     setSearchText(event.target.value);
    // }

    function searchTransactions(transactions) {
        if (searchText)
            transactions = transactions.filter(tran => tran.name.toLowerCase().includes(searchText.toLowerCase()));

        return transactions;
    }

    // ========================== SORT ======================================

    function changedSortKey(event) {
        setSortKey(event.target.value);
    }

    function sortTransactions(transactions) {
        switch (parseInt(sortKey)) {
            case 1:
                transactions.sort((a,b) => b.timestamp - a.timestamp );
                break;

            case 2:
                transactions.sort((a,b) => a.timestamp - b.timestamp );
                break;

            case 3:
                transactions.sort((a,b) => a.name.localeCompare(b.name) );
                break;

            case 4:
                transactions.sort((a,b) => b.name.localeCompare(a.name) );
                break;

            case 5:
                transactions.sort((a,b) => b.amount - a.amount );
                break;

            case 6:
                transactions.sort((a,b) => a.amount - b.amount );
                break;

            default:
                return [];
        }

        return transactions;
    }

// ========================== CATEGORY ======================================

    function changedCategoryKey(event) {
        setCategoryKey(event.target.value);
    }

    function filterByCategory(transactions) {
        switch (parseInt(categoryKey)) {
            case 999:  // All transactions
                break;

            default:
                transactions = transactions.filter(tran => tran.category_id === categoryKey);
                break;
        }


        return transactions;
    }

    // ========================= REFRESH =======================================

    function refresh() {
        let transactions = allTransactions.map(transaction => { return {...transaction} });
        transactions = filterByCategory(transactions);
        transactions = searchTransactions(transactions);
        transactions = sortTransactions(transactions);

        setViewTransactions(transactions);
    }

    useEffect(() => {
        refresh();
    }, [allTransactions, sortKey, categoryKey, searchText])

    let newTransactionData = {};

    function openAddTransaction() {
        newTransactionData = {"category_id":"", "amount":"0"};
        setOpenModal(true)
    }

    function closeModal() {
        setOpenModal(false);
    }

    function updateNewTransactionData(prop, val) {
        newTransactionData[prop] = val;
    }

    function saveNewTransaction(event) {
        event.preventDefault();

        newTransactionData.user_id = newTransactionData.user_id || "1";
        newTransactionData.date = new Date().toISOString().split('T')[0];

        DB.addTransaction(newTransactionData);

        const newTransaction = addTransactionExtraData(newTransactionData);

        let updatedTransactions = allTransactions.map(transaction => { return {...transaction} });
        updatedTransactions.push(newTransaction);
        setAllTransactions(updatedTransactions);

        setOpenModal(false);
    }

    function AddTransactionModal() {
        const title = "Add New Transaction";
        const subTitle = "";
        const options = categories.map(cat => { return { "value":cat.id, "text":cat.name}});
 
        return (
            <Modal 
                closeCallback={closeModal} 
                title={title}
                subtitle={subTitle}
            >
                <form onSubmit={ saveNewTransaction }>
                    <CustomSelect 
                        name="category" 
                        title="Category" 
                        required 
                        style={{"fontSize":"16px"}}
                        labelStyle= {{"fontSize":"16px"}}
                        updateCallback = {{"params":'category_id', "func":updateNewTransactionData}}
                        options = { options }
                        value = { options[0].value || ''}
                    />
                    
                    <CustomInput 
                        name="amount" 
                        type="number"
                        title="Amount" 
                        value="0"
                        updateCallback = {{"params":'amount', "func":updateNewTransactionData}}
                        style={{"fontSize":"16px"}}
                        labelStyle= {{"fontSize":"16px"}}
                    />
                    
                    <CustomButton 
                        name="save" 
                        text="Save" 
                        style={{"fontSize":"24px"}}
                        onClick= { saveNewTransaction }
                    />
                </form>
            </Modal>
        )
    }

    return (
        <div className="active-area">
            {
                openModal &&
                <AddTransactionModal />
            }

            <div className='header'>
                <div>
                    <CustomInput 
                        name="search" 
                        value={searchText}
                        updateCallback = {{"func":setSearchText}}
                        placeholder='Search Transaction'
                        icon='search'
                    />
                </div>
                <div className='filters'>
                    {
                        isMobile ? 
                        (
                        <span className='mobile-icons'>
                            <CustomIconSelect 
                                options={sortByOptions} 
                                value={sortKey} 
                                onChange={ changedSortKey } 
                                icon="fa fa-bars" 
                                selected={sortKey} 
                            />
                            
                            <CustomIconSelect 
                                options={categoryOptions} 
                                value={categoryKey} 
                                onChange={ changedCategoryKey }  
                                icon="fa fa-filter" 
                                selected={categoryKey} 
                            />
                        </span>
                        ) :
                        (
                        <>
                            <CustomSelect 
                                name="sortby" 
                                title="Sort by" 
                                updateCallback = {{"func": ((val) => { setSortKey(val) })}}
                                options = { sortByOptions }
                                value = { sortKey }
                                onerow
                            />

                            <CustomSelect 
                                name="category" 
                                title="Category" 
                                updateCallback = {{"func": ((val) => { setCategoryKey(val) })}}
                                options = { categoryOptions }
                                value = { categoryKey }
                                onerow
                            />
                        </>
                        )
                    }
                </div>

                {
                    isMobile ? (
                        <CustomIconButton 
                            name="add"
                            icon="fa fa-plus" 
                            style={{"fontSize":"24px"}}
                            onClick= { openAddTransaction }
                        />                        
                    ) :
                    (
                        <CustomButton 
                            name="add" 
                            text="Add New" 
                            type="button"
                            onClick= { openAddTransaction }
                        />
                    )
                }
            </div>

            <div>
                <table className='t-header'>
                    <tbody>
                        <tr>
                            <th>Recipient / Sender</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        {
                            viewTransactions.map(transaction => <TableRow key={transaction.id} data={transaction} resolution={resolution} />)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Transactions
