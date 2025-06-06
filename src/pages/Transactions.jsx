import { useState, useEffect, useContext } from 'react';
import './Transactions.css'
import { DB } from '../utils/DB';
import { MediaResolution } from '../contexts/MediaResolution';
import Modal from '../components/Modal';
import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import { CustomButton, CustomIconButton } from '../components/CustomButton';

function Input(props) {
    const inputStyle = {
        "fontSize":(props.fontSize || null),
        "padding":(props.padding || null),
        "borderRadius":(props.borderRadius || null),
    };

    return (
        <div className={`input-container ${props.resolution}`}>
            <div className='input-wrapper'>
                <input
                    className={`input-default-style ${props.resolution}`}
                    style={inputStyle}
                    type={props.type || 'text'}
                    placeholder={props.placeholder || null}
                    onChange={props.onChange || (() => {})}
                    value={props.value || ''}
                />
                {
                    (props.icon == 'search') &&
                    <i className={`fa fa-search`}></i>
                }
            </div>
        </div>
    )
}

function Select(props) {
    return (
        <div className='select-container'>
            <label htmlFor="sort">{props.title}</label>
            <select onChange={props.onChange ? ((e) => { props.onChange(e) }) : (() => {})}>
                {
                    props.options &&
                    props.options.map(option => (
                        <option key={option} value={option.toLowerCase()}>{option}</option>
                    ))
                }
            </select>            
        </div>
    )
}

function MobileSelect(props) {
    const [options, setOptions] = useState([]);

    function openOptions(event) {
        event.stopPropagation();

        if (options.length > 0)
            setOptions([]);
        else {
            setOptions(props.options);

            const clickHandle = () => {
                setOptions([]);
                window.removeEventListener('click', clickHandle);
            }

            window.addEventListener('click', clickHandle);
        }
    }

    function clickOption(event) {
        props.onChange(event);
        setOptions([]);
    }

    return (
        <div className='select-container mobile'>
            <i className={props.icon} onClick={ (e) => { openOptions(e); }}></i>
            <div className='dropdown-options'>
                {
                    props.options &&
                    options.map(option => (
                        <option 
                            key={option} 
                            className={`mobile-option ${(option.toLowerCase() === props.selected ? 'selected' : '')}`} 
                            value={option.toLowerCase()}
                            onClick={(e) => { clickOption(e) }}
                        >
                            {option}
                        </option>
                    ))
                }
            </div>
        </div>
    )
}

function TableRow({ data, resolution }) {
    let amount = `${data.amount > 0 ? '+' : '-'}$${parseFloat(Math.abs(data.amount)).toFixed(2)}`;

    return (resolution === 'mobile') ?
    (
        <tr>
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
    const sortByOptions = ['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'];
    
    const categories = DB.getTable('categories');
    const categoryOptions = ["All Transactions", ...categories.map(cat => cat.name)];

    const [allTransactions, setAllTransactions] = useState([]);
    const [viewTransactions, setViewTransactions] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const [sortKey, setSortKey] = useState('');
    const [categoryKey, setCategoryKey] = useState('');
    const [searchText, setSearchText] = useState('');
    
    const { isDesktop, isMobile } = useContext(MediaResolution);

    useEffect(() => {
        const transactionsTable = DB.getTable('transactions');

        const dataTable = transactionsTable.map(tran => {
            return addTransactionExtraData(tran)
        })
        
        setAllTransactions(dataTable);
        setViewTransactions(dataTable);

        setSortKey(sortByOptions[0].toLowerCase());
        setCategoryKey(categoryOptions[0].toLowerCase());
    }, [])

    function addTransactionExtraData(data) {
        return {
            ...data, 
            ...DB.getUsersJson()[data.user_id],
            "timestamp":new Date(data.date).getTime(),
            "date":new Date(new Date(data.date).getTime()).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}),
            "category": DB.getCategoriesJson()[data.category_id].name
        }
    }

    // ========================== SEARCH ======================================
    
    function searchOnChange(event) {
        setSearchText(event.target.value);
    }

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
        switch (sortKey) {
            case 'latest':
                transactions.sort((a,b) => b.timestamp - a.timestamp );
                break;

            case 'oldest':
                transactions.sort((a,b) => a.timestamp - b.timestamp );
                break;

            case 'a to z':
                transactions.sort((a,b) => a.name.localeCompare(b.name) );
                break;

            case 'z to a':
                transactions.sort((a,b) => b.name.localeCompare(a.name) );
                break;

            case 'highest':
                transactions.sort((a,b) => b.amount - a.amount );
                break;

            case 'lowest':
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
        switch (categoryKey) {
            case 'all transactions':
                break;

            default:
                transactions = transactions.filter(tran => tran.category.toLowerCase() === categoryKey);
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

    const resolution = isDesktop ? 'desktop' : 'mobile';

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
        const subTitle = "This is the sub title for adding a new transaction, please read and complete.";
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
                        style={{"fontSize":"24px"}}
                        labelStyle= {{"fontSize":"24px"}}
                        updateValue = {{"prop":'category_id', "func":updateNewTransactionData}}
                        options = { options }
                        value = { options[0].value || ''}
                    />
                    
                    <CustomInput 
                        name="amount" 
                        type="number"
                        title="Amount" 
                        value={newTransactionData.amount}
                        updateValue = {{"prop":'amount', "func":updateNewTransactionData}}
                        style={{"fontSize":"24px"}}
                        labelStyle= {{"fontSize":"24px"}}
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
                    <Input placeholder='Search Transaction' onChange={searchOnChange} icon='search' value={searchText} resolution={resolution} />
                </div>
                <div className='filters'>
                    {
                        isMobile ? 
                        (
                        <>
                            <MobileSelect options={sortByOptions} value={sortKey} onChange={ changedSortKey } icon="fa fa-bars" selected={sortKey} />
                            <MobileSelect options={categoryOptions} value={categoryKey} onChange={ changedCategoryKey }  icon="fa fa-filter" selected={categoryKey} />
                        </>
                        ) :
                        (
                        <>
                            <Select title='Sort by' options={sortByOptions} value={sortKey} onChange={ changedSortKey } />
                            <Select title='Category' options={categoryOptions} value={categoryKey} onChange={ changedCategoryKey } />
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
                        {/* <tr>
                            <th>Recipient / Sender</th>
                            <th>Category</th>
                            <th>Transaction Date</th>
                            <th>Amount</th>
                        </tr> */}

                        {
                            viewTransactions.map(transaction => <TableRow data={transaction} resolution={resolution} />)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Transactions
