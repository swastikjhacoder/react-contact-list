import React, { useState, useRef, useEffect } from 'react';
import './AddConctact.css';
import {db} from "../firebaseInit";
import { collection, doc, setDoc, onSnapshot, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddContact = () => {
  const [contactData, setContactData] = useState({name:"", email:"", mobile:""});
  const [contacts, setContacts] =  useState([]);
  const nameRef = useRef(null);
  const [updateContact, setUpdateContact] = useState(false);
  const [updateId, setUpdateId] = useState(-1);

  useEffect(() => {
    nameRef.current.focus();
  },[]);

  useEffect(() => {
      onSnapshot(collection(db, "contacts"), (snapShot) =>{
          const contacts = snapShot.docs.map((doc) => {
              return{
                  id: doc.id,
                  ...doc.data()
              }
          });
          setContacts(contacts);
          console.log(contacts);
      })
  },[]);

  async function handleSubmit(e) {
    e.preventDefault();
    const docRef = doc(collection(db, "contacts"));
    await setDoc(docRef, {
        name: contactData.name,
        email: contactData.email,
        mobile: contactData.mobile,
        createdOn: new Date()
    });
    nameRef.current.focus();
    setContactData({name: "", email: "", mobile: ""});
    toast.success('Contact added successfully!');
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const docRef = doc(db, "contacts", updateId);
    await updateDoc(docRef, {
      name: contactData.name,
      email: contactData.email,
      mobile: contactData.mobile,
      createdOn: new Date()
    });
      nameRef.current.focus();
      setContactData({name: "", email: "", mobile: ""});
      setUpdateContact(false);
      setUpdateId(-1);
      toast.warning('Contact updated successfully!');
  }

  async function editContact(id) {
    setUpdateContact(true);
    setUpdateId(id);
    const docRef = doc(db,"contacts",id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setContactData(docSnap.data());
    } else {
      console.log("No such document!");
    }
  }

  async function removeContact(id){
    const docRef = doc(db,"contacts",id);
    await deleteDoc(docRef);
    toast.error('Contact deleted successfully!');
  }

  return (
    <>
    <div className="heading">
      <div className="add__contact">
        <form onSubmit={updateContact===false ? handleSubmit : handleUpdate}>
          <div className="contact__input">
            <h2>{updateContact===false? "Add Contact" : "Update Contacts"}</h2>
            <input 
              type="text" 
              placeholder='Name...' 
              ref={nameRef} 
              defaultValue={contactData.name}
              onChange = {(e) => setContactData({name: e.target.value, email:contactData.email, mobile:contactData.mobile})}
              required />
            <input 
              type="email" 
              placeholder='Email...' 
              defaultValue={contactData.email}
              onChange = {(e) => setContactData({name: contactData.name, email:e.target.value, mobile:contactData.mobile})}
              required />
            <input 
              type="number" 
              placeholder='Mobile...' 
              defaultValue={contactData.mobile}
              onChange = {(e) => setContactData({name: contactData.name, email:contactData.email, mobile:e.target.value})}
              required />
              <button type='submit' className='contact__buttons'>{updateContact === true ? 'Update Contact' : 'Add Contact'}</button>
          </div>
        </form>
      </div>
      
      <hr/>

      <div className="contact__list">
        <h2>Contact List</h2>
        <hr/>
        {contacts.map((contact, index)=> {
          return (
            <>
            <div className="contact__details" key={index}>
              <div className="contact_info">
                  <h4>Name: {contact.name}</h4>
                  <p>Email: {contact.email}</p>
                  <p>Mobile: {contact.mobile}</p>
              </div>
              <div className="action__buttons">
                  <button onClick={() => {editContact(contact.id)}} className='edit'><i className='bx bx-edit-alt'></i></button>
                  <button onClick={() => {removeContact(contact.id)}} className='delete'><i className='bx bx-trash'></i></button>
              </div>
            </div>
            <hr/>
            </>
          );
        })}
      </div>
    </div>
    <ToastContainer/>
    </>
  );
};

export default AddContact;