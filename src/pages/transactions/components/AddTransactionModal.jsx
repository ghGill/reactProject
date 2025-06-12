import { useState } from "react";

import CustomInput from "../../../components/CustomInput";
import { CustomButton } from "../../../components/CustomButton";
import { CustomSelect } from "../../../components/CustomSelect";
import Modal from '../../../components/Modal'

function AddTransactionModal( {closeHandler, saveHandler, options } ) {
    const [newTransactionData, setNewTransaction] = useState({"category_id":"", "amount":"0"});

    function updateNewTransactionData(prop, val) {
        setNewTransaction({...newTransactionData, [prop]:val});
    }

    function saveData(event) {
        event.preventDefault();

        saveHandler(newTransactionData);
    }

    return (
        <Modal 
            closeCallback={closeHandler} 
        >
            <Modal.Title titleData= { {text:"Add New Transaction"} } />

            <form onSubmit={ saveData }>
                <CustomSelect 
                    selectData={
                        {
                            name: "category",
                            title: "Category", 
                            required: true, 
                            updateCallback: {"params":'category_id', "func":updateNewTransactionData},
                            options: options,
                            value: options[0].value || ''
                        }
                    }
                />
                
                <CustomInput 
                    inputData= {
                        {
                            name: "amount",
                            type: "number",
                            title: "Amount",
                            value: 0,
                            required: true,
                            updateCallback: {"params":'amount', "func":updateNewTransactionData}
                        }
                    }
                />
                
                <CustomButton 
                    btnData = {
                        {
                            name: "save" ,
                            text: "Save" ,
                            style: {"fontSize":"24px"},
                            type: "submit"
                        }
                    }
                />
            </form>
        </Modal>
    )
}

export default AddTransactionModal;
