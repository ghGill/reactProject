import { useState } from "react";
import Modal from "../../../components/Modal";
import CustomInput from "../../../components/CustomInput";
import { CustomButton } from "../../../components/CustomButton";
import { PotCardProgress } from "../Pots";

function PotTransactionModal( { closeHandler, saveHandler, errMsg, title, subtitle, opTitle }) {
    const [value, setValue] = useState(0);

    function saveData(event) {
        event.preventDefault();

        saveHandler(value);
    }

    return (
        <Modal 
            closeCallback={closeHandler} 
        >
            <Modal.Title 
                titleData= {{ text: title }} 
            />

            <Modal.SubTitle 
                subtitleData= {{ text: subtitle }} 
            />

            <PotCardProgress />

            <form onSubmit={ saveData }>
                <CustomInput 
                    inputData= {
                        {
                            name: "title",
                            type: "number",
                            title: opTitle,
                            value: value,
                            min: 0,
                            required: true,
                            updateCallback: {func: setValue}
                        }
                    }                
                />

                <CustomButton 
                    btnData = {
                        {
                            name: "save" ,
                            text: "Save", 
                            style: {"fontSize":"24px"},
                            type: "submit",
                            errMsg: errMsg
                        }
                    }
                />
            </form>
        </Modal>
    )
}

export default PotTransactionModal;
