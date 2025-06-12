import { useState, useContext } from "react";

import CustomInput from "../../../components/CustomInput";
import { CustomButton } from "../../../components/CustomButton";
import { CustomSelect } from "../../../components/CustomSelect";
import Modal from '../../../components/Modal'
import { DB } from "../../../utils/DB";
import { PotFormDataContext } from "../context/PotFormDataProvider";

function AddPotModal( {closeHandler, saveHandler } ) {
    const { updatePotData, getFormData, resetFormData } = useContext(PotFormDataContext);
    
    const colors = DB.getTable("colors");
    const colorsOptions = colors.map(color => {
        return (
            {
                value: color.id,
                text: color.name,
                style: {"color":color.name, "fontWeight":"bolder"}
            }
        )
    })

    function updateNewPotData(prop, val) {
        updatePotData(prop, val);
    }

    function saveData(event) {
        event.preventDefault();

        const potData = getFormData();
        saveHandler(potData);

        resetFormData();
    }

    return (
        <Modal 
            closeCallback={closeHandler} 
        >
            <Modal.Title 
                titleData= {{ text:"Add New Pot" }} 
            />

            <Modal.SubTitle 
                subtitleData= {{ text: "Create a pot to set savings targets. Theses can help keep you on track as you save for special purchases." }} 
            />

            <form onSubmit={ saveData }>
                <CustomInput 
                    inputData= {
                        {
                            name: "title",
                            title: "Pot Name",
                            value: getFormData("title"),
                            required: true,
                            updateCallback: {"params":'title', "func":updateNewPotData}
                        }
                    }                
                />
                
                <CustomInput 
                    inputData= {
                        {
                            name: "target",
                            type: "number",
                            min: 0,
                            title: "Target",
                            value: getFormData("target"),
                            required: true,
                            updateCallback: {"params":'target', "func":updateNewPotData}
                        }
                    }                
                />
                
                <CustomSelect 
                    selectData={
                        {
                            name: "color",
                            title: "Theme", 
                            required: true, 
                            updateCallback: {"params":'color_id', "func":updateNewPotData},
                            options:colorsOptions,
                            value: getFormData("color_id") || colorsOptions[0].value
                        }
                    }
                />
                
                <CustomButton 
                    btnData = {
                        {
                            name: "save" ,
                            text: "Save", 
                            style: {"fontSize":"24px"},
                            type: "submit"
                        }
                    }
                />
            </form>
        </Modal>
    )
}

export default AddPotModal;
