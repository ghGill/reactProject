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
import Loader from '../../components/Loader';

const PotCardContext = createContext(null);
const usePotCardContext = () => useContext(PotCardContext)

function PotCardHeader() {
    const { index, data, pots, setPots, colors, showLoader, hideLoader } = usePotCardContext();
    const { editPotData } = useContext(PotFormDataContext);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    function dotsMenuClick(op) {
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

    async function updatePot(data) {
        showLoader();

        const color = colors.find(clr => clr.id === parseInt(data.color_id));
        data.color = color.name;

        const pot = await DB.updatePot(data);

        const newpots = [...pots];
        newpots[index] = {...data};

        setPots(newpots);

        setOpenEditModal(false);

        hideLoader();
    }

    async function removePot() {
        showLoader();

        await DB.deletePot(data);

        const newPots = pots.filter(pot => pot.id !== data.id);

        setPots(newPots);

        setOpenDeleteModal(false);

        hideLoader();
    }

    return (
        <>
            {
                openEditModal &&
                <AddPotModal 
                    closeHandler = { () => {setOpenEditModal(false)} }
                    saveHandler = { updatePot }
                    colors = { colors }
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
                                updateCallback: {"func": ((val) => { dotsMenuClick(val) })},
                                icon: "fa fa-ellipsis-h" 
                            }
                        }
                    />
                </div>
            </div>
        </>
    )
}

export function calcSavedPercents(saved, target) {
    if (!saved || !target)
        return "0.00";

    return ((((saved * 100) / target) * 100) / 100).toFixed(2)
}

export function PotCardProgress() {
    const { color, saved, target } = usePotCardContext().data;

    const percents = calcSavedPercents(saved, target);

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
    const { index, data, pots, setPots, showLoader, hideLoader } = usePotCardContext();


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

    async function saveTransaction(value) {
        showLoader();

        const currentSaved = parseInt(data.saved);
        const transactionValue = parseInt(value);

        const factor = (transactionType === "add") ? 1 : -1;

        const newValue = currentSaved + (transactionValue * factor);

        if (newValue > parseInt(data.target)) {
            setErrMsg('Total amount is greater than target.');
            hideLoader();
            return;
        }

        if (newValue < 0) {
            setErrMsg('You cannot withdraw such an amount.');
            hideLoader();
            return;
        }

        data.saved = newValue;

        await DB.updatePot(data);

        const newpots = [...pots];
        newpots[index] = {...data};

        setPots(newpots);

        setOpenTransactionModal(false);

        hideLoader();
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

function PotCard( { index, data, pots, setPots, colors, showLoader, hideLoader } ) {
    const { mediaType } = useContext(MediaResolution);

    return (
        <div className={`pots-card ${ mediaType }`}>
            <>
                <PotCardContext.Provider value = {{ index, data, pots, setPots, colors, showLoader, hideLoader }}>
                    <PotCardHeader />
                    <PotCardProgress />
                    <PotCardFooter />
                </PotCardContext.Provider>
            </>
        </div>
    )
}

function PageHeader( { pots, setPots, colors, showLoader, hideLoader }) {
    const { resetFormData, getFormData } = useContext(PotFormDataContext);
    const [openAddModal, setOpenAddModal] = useState(false);

    async function savePot() {
        showLoader();

        let data = getFormData();
        data.saved = 0;

        const color = colors.find(clr => clr.id === parseInt(data.color_id));
        data.color = color.name;
        
        const result = await DB.addPot(data);
        data.id = result?.pot?.id || 0;
        
        setPots([...pots, data]);

        setOpenAddModal(false);

        hideLoader();
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
                    colors = { colors }
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

function PagePots({ dbPots, colors }) {
    const [pots, setPots] = useState(dbPots);
    const [displayLoader, setDisplayLoader] = useState(false);

    // ========================== LOADER ======================================

    function showLoader() {
        if (displayLoader)
            return;

        setDisplayLoader(true);
    }

    function hideLoader() {
        setDisplayLoader(false);
    }

    return (
        <>
            {
                displayLoader && <Loader />
            }

            <PageHeader 
                colors={ colors } 
                pots = { pots } 
                setPots={ setPots }
                showLoader = { showLoader }
                hideLoader = { hideLoader }
            />

            <div className='pots-cards-wrapper'>
                {
                    pots.map((pot, index) => {
                        return (
                            <PotCard 
                                key = { pot.id }
                                index= { index }
                                data= { pot }
                                colors={ colors } 
                                pots = { pots } 
                                setPots={ setPots }
                                showLoader = { showLoader }
                                hideLoader = { hideLoader }
                            />
                        )
                    })
                }
            </div>
        </>
    )
}

function Pots( { pageIsReady }) {
    const [dbPots, setDbPots] = useState([]);
    const [colors, setColors] = useState([]);

    async function getPotsList() {
        let result = await DB.getPotsList();
        setDbPots(result.pots);

        result = await DB.getColorsList();
        setColors(result.colors);

        pageIsReady();
    }

    useEffect(() => {
        getPotsList();
    }, [])

    return (
        <>
            {
                (dbPots.length > 0) &&
                <PotFormDataProvider>
                    <div className="pots-active-area">
                        <PagePots dbPots={dbPots} colors= { colors }/>
                    </div>
                </PotFormDataProvider>
            }
        </>
    )
}

export default Pots
