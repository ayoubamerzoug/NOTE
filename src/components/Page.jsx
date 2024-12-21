import React, { useState, useEffect } from "react";
import axios from "axios";
import photo from "../images/Profilee.jpg";
import "../styles/Page.css";
import "../styles/Modal.css";
import { motion } from "framer-motion";
import Loading from "./Loading";
const Page = (props) => {
  const myToken = localStorage.getItem("token");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isModifyModalOpen, setModifyModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [noteToModify, setNoteToModify] = useState({ title: "", content: "" });

  const fetchNotes = () => {
    setLoading(true);
    axios
      .get("https://notes.devlop.tech/api/notes", {
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      })
      .then((res) => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, [myToken]);

  const handleAdd = () => {
    if (newNote.title && newNote.content) {
      axios
        .post("https://notes.devlop.tech/api/notes", newNote, {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        })
        .then(() => {
          fetchNotes();
          setNewNote({ title: "", content: "" });
          setAddModalOpen(false);
        })
        .catch((err) => console.error("Error adding note:", err));
    } else {
      alert("Please enter a title and content.");
    }
  };

  const handleModify = () => {
    if (noteToModify.title && noteToModify.content) {
      axios
        .put(
          `https://notes.devlop.tech/api/notes/${noteToModify.id}`,
          noteToModify,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        )
        .then(() => {
          fetchNotes();
          setModifyModalOpen(false);
        })
        .catch((err) => console.error("Error modifying note:", err));
    } else {
      alert("Please enter a title and content.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      axios
        .delete(`https://notes.devlop.tech/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        })
        .then(() => {
          fetchNotes();
        })
        .catch((err) => console.error("Error deleting note:", err));
    }
  };

  const toggleUpdate = (id) => {
    setActiveNoteId((prev) => (prev === id ? null : id));
  };

  const openModifyModal = (note) => {
    setNoteToModify(note);
    setModifyModalOpen(true);
  };

  const LogOut = () => {
    props.setisConnected(false);
  };

  return (
    <div className="container">
      <div className="leftSide">
        <div className="profile">
          <img className="myImg" src={photo} alt="user" />
          <p>Hello {firstName + " " + lastName}</p>
          <p className="Student">Student</p>
        </div>
        <motion.button
        style={{display: "flex", justifyContent: "center", alignItems: "center"}}
          whileHover={{ scale: 1.3 }}
          className="LogOut"
          onClick={LogOut}
        > 
          <svg style={{ width: "20px", height: "20px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fff" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>
        </motion.button>
      </div>
      <div className="rightSide">
        <div className="NotesList">
          <h2>Notes List</h2>
          <div className="btns">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="Add"
              onClick={() => setAddModalOpen(true)}
            >
              Add New Note
            </motion.button>
          </div>
        </div>
        <div className="Notes">
          <table>
            <thead>
              <tr className="thead">
                <th>Id</th>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                notes.map((note) => (
                  <tr key={note.id}>
                    <td>{note.id}</td>
                    <td>{note.title}</td>
                    <td>{note.content}</td>
                    <td>
                      <motion.button
                        className="Delete update"
                        style={{display:"flex", justifyContent: "center", alignItems: "center"}}
                        whileHover={{ scale: 1.3 }}
                        onClick={() => openModifyModal(note)}
                      >
                        <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fff" d="M368.4 18.3L312.7 74.1 437.9 199.3l55.7-55.7c21.9-21.9 21.9-57.3 0-79.2L447.6 18.3c-21.9-21.9-57.3-21.9-79.2 0zM288 94.6l-9.2 2.8L134.7 140.6c-19.9 6-35.7 21.2-42.3 41L3.8 445.8c-3.8 11.3-1 23.9 7.3 32.4L164.7 324.7c-3-6.3-4.7-13.3-4.7-20.7c0-26.5 21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48c-7.4 0-14.4-1.7-20.7-4.7L33.7 500.9c8.6 8.3 21.1 11.2 32.4 7.3l264.3-88.6c19.7-6.6 35-22.4 41-42.3l43.2-144.1 2.7-9.2L288 94.6z"/></svg>
                        </motion.button>
                      <motion.button
                      style={{display:"flex"
                      ,alignItems:"center",
                      justifyContent:"center"
                      }}
                        className="Delete"
                        whileHover={{ scale: 1.3 }}
                        onClick={() => handleDelete(note.id)}
                      >
                        <svg style={{ width: "1em", height: "1em" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                      </motion.button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <Loading />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Note</h3>
            <input
              style={{
                color : '#000',
              }}
              type="text"
              placeholder="Title"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
            />
            <textarea
              placeholder="Content"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
            ></textarea>
            <div className="modal-actions">
              <button onClick={handleAdd}>Add Note</button>
              <button onClick={() => setAddModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isModifyModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Modify Note</h3>
            <input
              type="text"
              style={{ color : '#000',
              }}
              placeholder="Title"
              value={noteToModify.title}
              onChange={(e) =>
                setNoteToModify({ ...noteToModify, title: e.target.value })
              }
            />
            <textarea
              placeholder="Content"
              style={{ color : '#000',
                display : "flex",
                justifyContent : "center",
                alignItems : "center",
              }}
              value={noteToModify.content}
              onChange={(e) =>
                setNoteToModify({ ...noteToModify, content: e.target.value })
              }
            ></textarea>
            <div className="modal-actions">
              <button onClick={handleModify}>Save Changes</button>
              <button onClick={() => setModifyModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
