import { Component } from "react";
import { nanoid } from "nanoid";
import styled from "styled-components";

import PhonebookForm from "./PhonebookItems/PhonebookForm";
import ContactList from "./ContactList/ContactList";
import Filter from './Filter/FIlter'

class PhonebookWrapper extends Component {
    state = {
        contacts: [],
        filter: ''
    }

    isDublicate = ({ name, number }) => {
        const normalizedName = name.toLowerCase();
        const normalizedNumber = number.toLowerCase();
        const { contacts } = this.state;

        const dublicate = contacts.find(item => {
            const normalizedCurrentName = item.name.toLowerCase();
            const normalizedCurrentNumber = item.number.toLowerCase();

            return (normalizedCurrentNumber === normalizedNumber && normalizedCurrentName === normalizedName);
        })

        return Boolean(dublicate);
    }

    addContacts = (data) => {
        const { name, number } = data;
        

        if(this.isDublicate(data)) return alert(`Contact with name: ${name} and number: ${number} already exist`)

        this.setState(({ contacts }) => {
            const newContact = {
                id: nanoid(),
                ...data
            }

        const settings = [...contacts, newContact]
        localStorage.setItem("settings", JSON.stringify(settings));

        return {
             contacts: settings,
        }
        })
    }

    deleteContact = (id) => {
        this.setState(({ contacts }) => {
            const newContacts = contacts.filter(item => item.id !== id);
        
             localStorage.setItem("settings", JSON.stringify(newContacts));

            return {
                contacts: newContacts,
            }
        
        })
    }


    changeFilter = ({ target }) => {
        this.setState({
            filter: target.value,
        })
    }


    getFilteredContacts = () => {
        const { filter, contacts } = this.state;
        if (!filter) return contacts;

        const normalizeFilter = filter.toLowerCase();

        const filterContacts = contacts.filter(({name, number}) => {
            const normalizedName = name.toLowerCase();

            return (normalizedName.includes(normalizeFilter) || number.includes(normalizeFilter))
        })

        return filterContacts;
    }


    componentDidMount() {
        try {
            const savedSettings = localStorage.getItem("settings");
            const parsedSettings = JSON.parse(savedSettings);
            this.setState({ contacts: parsedSettings || [] })
        } catch (error) {
            console.error("Error loading data from localStorage:", error);
            console.log("Error", error);
        }
    }



    render() {
        const { addContacts, deleteContact, changeFilter } = this;
        const { filter } = this.state;
        const contacts = this.getFilteredContacts();

        return (
            <div>
                <PhonebookForm onSubmit={addContacts} />
                <ContactListWrapper>
                    <h2>Contacts</h2>
                    <Filter value={filter} onChange={changeFilter} />
                    <ContactList items={contacts} deleteContact={deleteContact} />
                </ContactListWrapper>
            </div>
        )
    }
}

const ContactListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 300px;
    gap: 20px;
    padding: 20px 0;
    margin: 40px auto;
    border: 1px solid;
    border-radius: 25px;

        button{
            cursor: pointer;
            font-size: 8px;
            width: 48px;
        }
`


export default PhonebookWrapper;




