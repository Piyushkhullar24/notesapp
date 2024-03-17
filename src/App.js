import { useEffect, useState } from "react";
import {nanoid} from 'nanoid';
import NotesList from "./components/NotesList";
import Search from "./components/Search";

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

  
  useEffect(async () =>{
    const savedNotes = JSON.parse(localStorage.getItem('react-notes-app-data'));

    if(savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(async () =>{
    localStorage.setItem('react-notes-app-data', JSON.stringify(notes));
    const res = await fetch('https://notesapp-6fbef-default-rtdb.firebaseio.com/notes.json', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(notes)
            })
          
  }, [notes]);

  const addNote = (text) => {
      const date = new Date();
      const newNote = {
        id: nanoid(),
        text: text,
        date: date.toLocaleDateString()
      }
      const newNotes = [...notes, newNote];
      setNotes(newNotes);
  }

  const deleteNote = (id) => {
      const newNotes =  notes.filter((note) => note.id !== id);
      setNotes(newNotes);
  }

  return (<div className="container">
    <Search handleSearchNote = {setSearchText}/>
    <NotesList notes={notes.filter((note) => note.text.toLowerCase().includes(searchText))} handleAddNote = {addNote} handleDeleteNote = {deleteNote}/>
  </div>)
}

export default App;