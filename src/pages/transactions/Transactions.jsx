import { useState, useEffect, useContext, useRef } from 'react';
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
import Loader from '../../components/Loader';

function Transactions( { pageIsReady }) {
    const ROWS_PER_PAGE = 10;

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
    
    const allOption = {"value":999, "text": "All Transactions"};
    const [modalOptions, setModalOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([allOption]);

    const [unFilteredTransactions, setUnFilteredTransactions] = useState([]);
    const [viewTransactions, setViewTransactions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [displayLoader, setDisplayLoader] = useState(false);

    const [sortKey, setSortKey] = useState(1);
    const [categoryKey, setCategoryKey] = useState(allOption.value);
    const [searchText, setSearchText] = useState('');
    
    const { isMobile, mediaType } = useContext(MediaResolution);

    const { getUser } = useContext(AuthContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [transactionsPerCategory, setTransactionsPerCategory] = useState({});
    const ignoreUpdatePagination = useRef(false);

    // read all categories from DB
    async function getCategoriesList() {
        const result = await DB.getCategoriesList();

        setModalOptions(result.categories.map(cat => { return { "value":cat.id, "text":cat.name}}));
        setCategoryOptions([allOption, ...result.categories.map(cat => { return {"value": cat.id, "text":cat.name}})]);
    }

    // ========================== LOADER ======================================

    function showLoader() {
        if (displayLoader)
            return;

        setDisplayLoader(true);
    }

    function hideLoader() {
        setDisplayLoader(false);
    }
    
    // ========================== TRANSACTION PER CATEGORY ======================================

    async function getTransactionsPerCategory() {
        const result = await DB.getTransactionsPerCategory();

        let obj = {};
        let totalRecords = 0;
        result.transactions.forEach(tran => {
            obj[tran.cat_id] = tran.total;
            totalRecords += Number(tran.total);
        })

        obj[allOption.value] = totalRecords;

        setTransactionsPerCategory({...obj});
    }

    function updateCategoryTransactions(catId, delta) {
        let obj = {...transactionsPerCategory};

        let val = Number(obj[catId]) + delta;
        obj[catId] = String(val);

        val = Number(obj[allOption.value]) + delta;
        obj[allOption.value] = String(val);

        setTransactionsPerCategory({...obj});
    }

    useEffect(() => {
        if(Object.keys(transactionsPerCategory).length == 0)
            return;

        if (!ignoreUpdatePagination.current ) {
            updatePagination();
            ignoreUpdatePagination.current = true;
        }
        else
            updatePagination(false);

    }, [transactionsPerCategory])

    // ========================== PAGINATION ======================================

    function updatePagination(resetPage = true) {
        if (!transactionsPerCategory)
            return;

        setTotalPages(Math.ceil(transactionsPerCategory[categoryKey] / ROWS_PER_PAGE));

        if (resetPage)
            setCurrentPage(1);
    }

    useEffect(() => {
       getPageTransactions();
    }, [currentPage])

    // ========================== SEARCH ======================================

    function searchTransactions() {
        const transactions = [...unFilteredTransactions];

        if (searchText)
            setViewTransactions(transactions.filter(tran => tran.name.toLowerCase().includes(searchText.toLowerCase())));
        else
            setViewTransactions(transactions);
    }

    useEffect(() => {
        searchTransactions();
    }, [searchText])

    // ========================== SORT ======================================

    function changedSortKey(value) {
        setSortKey(value);
    }

    useEffect(() => {
       getPageTransactions(); 
    }, [sortKey])

// ========================== CATEGORY ======================================

    function changedCategoryKey(value) {
        setCategoryKey(value);
    }

    useEffect(() => {
       getPageTransactions(); 
       updatePagination();
    }, [categoryKey])

    // ================= ADD TRANSACTION MODAL ==============================

    function openAddTransactionModal() {
        setOpenModal(true)
    }

    function closeModal() {
        setOpenModal(false);
    }

    async function saveNewTransaction(data) {
        showLoader();

        data.user_id = getUser('id');
        data.date = new Date().toISOString().split('T')[0];

        await DB.addTransaction(data);

        updateCategoryTransactions(data.category_id, 1);

        getPageTransactions();

        closeModal();

        hideLoader();
    }

    // ================= MAIN ==============================

    async function getPageTransactions() {
        showLoader();

        const result = await DB.getPageTransactions(categoryKey, sortKey, currentPage, ROWS_PER_PAGE);

        setUnFilteredTransactions(result.transactions);
        setViewTransactions(result.transactions);
        setSearchText('');

        hideLoader();
    }

    useEffect(() => {
        getTransactionsPerCategory()
            .then(result => {
                getPageTransactions()
                    .then(result => {
                        getCategoriesList()
                            .then(result => {
                                pageIsReady();
                            })
                    })
            })
    }, [])

    // ================= HTML ==============================

    return (
        <div className="transactions-active-area">
            {
                displayLoader && <Loader />
            }

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
                                        updateCallback: {"func": ((val) => { changedSortKey(val) })},
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
                                        updateCallback: {"func": ((val) => { changedCategoryKey(val) })},
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
                                        updateCallback: {"func": ((val) => { changedSortKey(val) })},
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
                                        updateCallback: {"func": ((val) => { changedCategoryKey(val) })},
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
