import { useState, createContext } from "react";

export const PotFormDataContext = createContext(null);

const emptyPotFormData = {
    "id":0,
    "title":"",
    "color_id":"",
    "target":0,
    "saved":0
}

export function PotFormDataProvider({ children }) {
    const [formData, setFormData] = useState(emptyPotFormData);

    function resetFormData() {
        setFormData(emptyPotFormData)
    }

    function editPotData(data) {
        const fields = Object.keys(emptyPotFormData);
        let editData = {};
        for (let ind in fields) {
            const prop = fields[ind];
            editData[prop] = data[prop];
        }

        setFormData(editData);
    }

    function updatePotData(prop, value) {
        setFormData({...formData, [prop]:value});
    }

    function getFormData(prop=null) {
        if (prop)
            return formData[prop];
        else
            return formData;
    }

    return (
        <PotFormDataContext.Provider value = {{ resetFormData, editPotData, updatePotData, getFormData}} >
            { children }
        </PotFormDataContext.Provider>
    )
}

export default PotFormDataProvider;
