import { useState, useEffect, useContext, createContext } from 'react';
import './Pots.css'
import { DB } from '../../utils/DB';
import { MediaResolution } from '../../contexts/MediaResolution';
import { CustomButton } from '../../components/CustomButton';
import { CustomIconSelect } from '../../components/CustomSelect'
import AddPotModal from './components/AddPotModal';
import PotFormDataProvider, { PotFormDataContext } from './context/PotFormDataProvider';
import ConfirmModal from '../../components/ConfirmModal';
import PotTransactionModal from './components/PotTransactionModal';

const PotCardContext = createContext(null);
const usePotCardContext = () => useContext(PotCardContext)

function PotCardHeader() {
    const { data, refreshPots } = usePotCardContext();
    const { editPotData } = useContext(PotFormDataContext);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    function dotsMenuClick(event) {
        const op = event.target.value;

        editPotData(data);

        switch (op) {
            case 'edit':
                setOpenEditModal(true);
                break;

            case 'delete':
                setOpenDeleteModal(true);
                break;
        }
    }

    function updatePot(data) {
        const colorsJson = DB.getColorsJson();

        data.color = colorsJson[data.color_id].name

        DB.updatePot(data);

        refreshPots();

        setOpenEditModal(false);
    }

    function removePot() {
        DB.deletePot(data.id);

        setOpenDeleteModal(false);

        refreshPots();
    }

    return (
        <>
            {
                openEditModal &&
                <AddPotModal 
                    closeHandler = { () => {setOpenEditModal(false)} }
                    saveHandler = { updatePot }
                />
            }

            {
                openDeleteModal &&
                <ConfirmModal 
                    titleData = {{text: `Delete '${data.title}'?`, style:{fontSize:"36px"}}}
                    subtitleData = {{text:"Are you sure you want to delete this pot? This action cannot be reversed and all the data inside it will be removed forever"}} 
                    yesData = {
                        { 
                            text:"Yes, Confirm Deletion", 
                            style:{"backgroundColor":"red", "border":"none", "padding":"16px", "fontWeight":"bold"}, 
                            noHover:true,
                            actionHandler: removePot
                        }
                    }
                    noData = {
                        { 
                            text:"No, Go Back", 
                            style:{"backgroundColor":"white", "color":"black", "padding":"16px", "border":"none"}
                        }
                    }
                    closeHandler = { () => {setOpenDeleteModal(false)} }
                />
            }

            <div className='header'>
                <div className='left'>
                    <div className='circle' style={{backgroundColor: data.color }}></div>
                    <div>{ data.title }</div>
                </div>

                <div className='right'>
                    <CustomIconSelect 
                        selectData={
                            {
                                options: [
                                    {
                                        value:"edit", 
                                        text:'Edit Pot',
                                        style: {"textAlign":"left", "padding":"8px 8px 0", "fontSize": "16px"}
                                    }, 
                                    {
                                        value:"delete", 
                                        text:'Delete Pot',
                                        style:{"color":"red", "padding":"8px 8px 0", "fontSize": "16px"}
                                    }
                                ],
                                onChange: dotsMenuClick,
                                icon: "fa fa-ellipsis-h" 
                            }
                        }
                    />
                </div>
            </div>
        </>
    )
}

export function PotCardProgress() {
    const { color, saved, target } = usePotCardContext().data;

    const percents = ((((saved * 100) / target) * 100) / 100).toFixed(2);

    return (
        <div className='data'>
            <div className='up'>
                <div className='data-small-font'>Total Saved</div>
                <div className='data-big-font'>{`$${saved.toFixed(2)}`}</div>
            </div>

            <div className='bars'>
                <div className={`bar full`}></div>
                <div className={`bar progress`} style={{width:`${parseFloat(percents)}%`, backgroundColor: color}}></div>
            </div>

            <div className='down'>
                <div className='data-small-font'>{`${percents}%`}</div>
                <div className='data-small-font'>{`Target of $${target}`}</div>
            </div>
        </div>
    )
}

function PotCardFooter() {
    const { isMobile, mediaType } = useContext(MediaResolution);
    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalSubTitle, setModalSubTitle] = useState('');
    const [modalOperationTitle, setModalOperationTitle] = useState('');
    const { data, refreshPots } = usePotCardContext();


    const buttonStyle = {"padding": isMobile ? null : "16px"};

    function btnTransactionClick(event) {
        const op = event.target.value;

        setErrMsg('');
        setTransactionType(op);
        if (op === 'add') {
            setModalTitle(`Add to '${data.title}'`);
            setModalSubTitle('Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.');
        }
        else {
            setModalTitle(`Withdraw from '${data.title}'`);
            setModalSubTitle('Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.');
        }
        
        setModalOperationTitle(`Amount to ${(op == 'add') ? 'Add' : 'Withdraw'}`);
        setOpenTransactionModal(true);
    }

    function saveTransaction(value) {
        const currentSaved = parseInt(data.saved);
        const transactionValue = parseInt(value);

        const factor = (transactionType === "add") ? 1 : -1;

        const newValue = currentSaved + (transactionValue * factor);

        if (newValue > parseInt(data.target)) {
            setErrMsg('Total amount is greater than target.');
            return;
        }

        if (newValue < 0) {
            setErrMsg('You cannot withdraw such an amount.');
            return;
        }

        data.saved = newValue;

        DB.updatePot(data);

        setOpenTransactionModal(false);

        refreshPots();
    }

    return (
        <>
            {
                openTransactionModal &&
                <PotTransactionModal 
                    closeHandler = { () => {setOpenTransactionModal(false)} }
                    saveHandler = { saveTransaction }
                    errMsg = { errMsg }
                    title = { modalTitle }
                    subtitle = { modalSubTitle }
                    opTitle = { modalOperationTitle }
                />
            }

            <div className='buttons'>
                <div className={`btn-wrapper ${ mediaType }`}>
                    <CustomButton
                        btnData = {
                            {
                                name: "add", 
                                text: "Add Money",
                                style: buttonStyle,
                                value: "add",
                                onClick: btnTransactionClick
                            }
                        }       
                    />
                </div>

                <div className='btn-wrapper'>
                    <CustomButton 
                        btnData = {
                            {
                                name: "withdraw", 
                                text: "Withdraw",
                                style: buttonStyle,
                                value: "withdraw",
                                onClick: btnTransactionClick
                            }
                        }       
                    />
                </div>
            </div>
        </>
    )
}

function PotCard( { data, refreshPots } ) {
    const { mediaType } = useContext(MediaResolution);

    return (
        <div className={`pots-card ${ mediaType }`}>
            <>
                <PotCardContext.Provider value = {{ data, refreshPots }}>
                    <PotCardHeader />
                    <PotCardProgress />
                    <PotCardFooter />
                </PotCardContext.Provider>
            </>
        </div>
    )
}

function PageHeader( { refreshPots }) {
    const { resetFormData, getFormData } = useContext(PotFormDataContext);
    const [openAddModal, setOpenAddModal] = useState(false);

    function savePot() {
        const colorsJson = DB.getColorsJson();

        let data = getFormData();
        data.saved = 0;
        data.color = colorsJson[data.color_id].name;

        DB.addPot(data);

        refreshPots();

        setOpenAddModal(false);
    }

    function addNewPot() {
        resetFormData();
        setOpenAddModal(true);
    }

    return (
        <>
            {
                openAddModal &&
                <AddPotModal 
                    closeHandler = { () => {setOpenAddModal(false)} }
                    saveHandler = { savePot }
                />
            }

            <div className='header'>
                <CustomButton 
                    btnData = {
                        {
                            name: "add" ,
                            text: "Add New Pot" ,
                            type: "button",
                            onClick: addNewPot
                        }
                    }       
                />
            </div>
        </>
    )
}

function PagePots() {
    const [pots, setPots] = useState([]);

    useEffect(() => {
        refreshPots();
    }, [])

    function refreshPots() {
        const colorsJson = DB.getColorsJson();
        const potsTable = DB.getTable('pots').map(color => {
            return { ...color, color:colorsJson[color.color_id].name }
        });

        setPots(potsTable);
    }

    return (
        <>
            <PageHeader refreshPots={ refreshPots }/>

            <div className='pots-cards-wrapper'>
                {
                    pots.map(pot => {
                        return (
                            <PotCard 
                                key = { pot.id }
                                data= { pot }
                                refreshPots = { refreshPots }
                            />
                        )
                    })
                }
            </div>
        </>
    )
}

function Pots() {
    return (
        <PotFormDataProvider>
            <div className="pots-active-area">
                <PagePots />
            </div>
        </PotFormDataProvider>
    )
}

export default Pots
