import { useState, useEffect, useContext } from 'react';
import './Transactions.css'
import { DB } from '../../utils/DB';
import { MediaResolution } from '../../contexts/MediaResolution';
import CustomInput from '../../components/CustomInput';
import { CustomSelect, CustomIconSelect } from '../../components/CustomSelect';
import { CustomButton, CustomIconButton } from '../../components/CustomButton';
import { AuthContext } from '../../contexts/AuthContext';
import TransactionRow from './components/TransactionRow';
import Pagination from './components/Pagination';
import AddTransactionModal from './components/AddTransactionModal'

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
    const modalOptions = categories.map(cat => { return { "value":cat.id, "text":cat.name}});
    const categoryOptions = [allOption, ...categories.map(cat => { return {"value": cat.id, "text":cat.name}})];

    const [pageTransactions, setPageTransactions] = useState([]);
    const [viewTransactions, setViewTransactions] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const [sortKey, setSortKey] = useState('');
    const [categoryKey, setCategoryKey] = useState('');
    const [searchText, setSearchText] = useState('');
    
    const { isMobile, mediaType } = useContext(MediaResolution);

    const context = useContext(AuthContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setSortKey(sortByOptions[0].value);
        setCategoryKey(categoryOptions[0].value);
    }, [])

    useEffect(() => {
        const transactions = getCurrentPageTransaction();

        setPageTransactions(transactions);
    }, [currentPage])

    function getCurrentPageTransaction() {
        const rowsPerPage = 10;

        const transactionsTable = DB.getTable('transactions');
        let pages =  Math.floor(transactionsTable.length / rowsPerPage);
        if ((pages * rowsPerPage) < transactionsTable.length)
            pages++;
        setTotalPages(pages);

        const dataTable = transactionsTable.map(tran => {
            return addTransactionExtraData(tran)
        })

        const from = (currentPage - 1) * rowsPerPage;

        const records = dataTable.slice(from, from + (rowsPerPage));

        return records;
    }

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
        let transactions = pageTransactions.map(transaction => { return {...transaction} });
        transactions = filterByCategory(transactions);
        transactions = searchTransactions(transactions);
        transactions = sortTransactions(transactions);

        setViewTransactions(transactions);
    }

    useEffect(() => {
        refresh();
    }, [pageTransactions, sortKey, categoryKey, searchText])

    // ================= MODAL ==============================

    function openAddTransactionModal() {
        setOpenModal(true)
    }

    function closeModal() {
        setOpenModal(false);
    }

    function saveNewTransaction(data) {
        data.user_id = context.user.id;
        data.date = new Date().toISOString().split('T')[0];

        DB.addTransaction(data);

        const newTransaction = addTransactionExtraData(data);

        let updatedTransactions = pageTransactions.map(transaction => { return {...transaction} });
        updatedTransactions.push(newTransaction);
        setPageTransactions(updatedTransactions);

        closeModal();
    }

    return (
        <div className="transactions-active-area">
            {
                openModal &&
                <AddTransactionModal 
                    closeHandler = { closeModal }
                    saveHandler = { saveNewTransaction }
                    options = { modalOptions }
                />
            }

            <div className='header'>
                <div>
                    <CustomInput 
                        inputData= {
                            {
                                name: "search",
                                value: searchText,
                                updateCallback: {"func":setSearchText},
                                placeholder: 'Search Transaction',
                                icon: 'search'
                            }
                        }                    
                    />
                </div>
                <div className='filters'>
                    {
                        isMobile ? 
                        (
                        <span className='mobile-icons'>
                            <CustomIconSelect 
                                selectData={
                                    {
                                        options: sortByOptions,
                                        value: sortKey, 
                                        onChange: changedSortKey,
                                        icon: "fa fa-bars",
                                        selected: sortKey
                                    }
                                }
                            />
                            
                            <CustomIconSelect 
                                selectData={
                                    {
                                        options: categoryOptions,
                                        value: categoryKey,
                                        onChange: changedCategoryKey,
                                        icon: "fa fa-filter",
                                        selected: categoryKey
                                    }
                                }
                            />
                        </span>
                        ) :
                        (
                        <>
                            <CustomSelect 
                                selectData={
                                    {
                                        name: "sortby",
                                        title: "Sort by",
                                        updateCallback: {"func": ((val) => { setSortKey(val) })},
                                        options: sortByOptions,
                                        value: sortKey,
                                        onerow:true
                                    }
                                }
                            />

                            <CustomSelect 
                                selectData={
                                    {
                                        name: "category",
                                        title: "Category",
                                        updateCallback: {"func": ((val) => { setCategoryKey(val) })},
                                        options: categoryOptions,
                                        value: categoryKey,
                                        onerow: true
                                            }
                                }
                            />
                        </>
                        )
                    }
                </div>

                {
                    isMobile ? (
                        <CustomIconButton 
                            btnData = {
                                {
                                    name: "add",
                                    icon: "fa fa-plus",
                                    style: {"fontSize":"24px"},
                                    onClick: openAddTransactionModal
                                }
                            }                            
                        />                        
                    ) :
                    (
                        <CustomButton 
                            btnData = {
                                {
                                    name: "add", 
                                    text: "Add New" ,
                                    type: "button",
                                    onClick: openAddTransactionModal
                                }
                            }                            
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
                            viewTransactions.map(transaction => <TransactionRow key={transaction.id} data={transaction} mediaType={mediaType} />)
                        }
                    </tbody>
                </table>
            </div>

            <Pagination 
                currentPage={ currentPage } 
                totalPages={ totalPages } 
                onClick={ setCurrentPage }
                mediaType={ mediaType }
            />
        </div>
    )
}

export default Transactions
