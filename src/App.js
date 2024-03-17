import { useEffect, useState } from "react";
import {nanoid} from 'nanoid';
import NotesList from "./components/NotesList";
import Search from "./components/Search";
import { async } from "q";

const App = () => {
  const [notes, setNotes] = useState([{
    id: nanoid(),
    text: "This is my first note",
    date: "15/04/2024"
  },
  {
    id: nanoid(),
    text: "This is my second note",
    date: "15/04/2024"
  },
  {
    id: nanoid(),
    text: "This is my third note",
    date: "15/04/2024"
  }]);

  const [searchText, setSearchText] = useState(''); 

  
  useEffect(() =>{
    async function fetchData() {
      const response=await fetch('https://notesapp-6fbef-default-rtdb.firebaseio.com/notes.json');
       const data=await response.json();
       if(data){
       const parsedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
       setNotes(parsedData);
       console.log(parsedData);
       if(parsedData) {
        setNotes(parsedData);
      }
    }
            }
            fetchData();
    // const savedNotes = JSON.parse(localStorage.getItem('react-notes-app-data'));

   
  }, []);

  useEffect(() =>{
    // async function fetchData() {
    //   const firebase = {notes: notes};
    // localStorage.setItem('react-notes-app-data', JSON.stringify(notes));
   
          // fetchData();
  }, [notes]);

  const addNote = async (text) => {
      const date = new Date();
      const newNote = {
        id: nanoid(),
        text: text,
        date: date.toLocaleDateString()
      }
      const newNotes = [...notes, newNote];
      setNotes(newNotes);
      
      await fetch('https://notesapp-6fbef-default-rtdb.firebaseio.com/notes.json', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(newNote)
              })
            
          
  }

  const findKeyById = (data, id) => {
    for (const key in data) {
      if (data[key].id === id) {
        return key;
      }
    }
    return null; // Return null if item with given ID is not found
  };

  const deleteNote = async (id) => {
       const newNotes =  notes.filter((note) => note.id !== id);
       const response=await fetch('https://notesapp-6fbef-default-rtdb.firebaseio.com/notes.json');
       const data = await response.json();
       const item = findKeyById(data, id);
      //  console.log('delte', data);
      //  const delteNote = data.find(x => x.id == id);
       console.log(item);

      await fetch(`https://notesapp-6fbef-default-rtdb.firebaseio.com/notes/${item}.json`, {
        method: 'DELETE',
              })
      setNotes(newNotes);
  }

  return (<div className="container">
    <Search handleSearchNote = {setSearchText}/>
    <NotesList notes={notes.filter((note) => note.text.toLowerCase().includes(searchText))} handleAddNote = {addNote} handleDeleteNote = {deleteNote}/>
  </div>)
}

export default App;