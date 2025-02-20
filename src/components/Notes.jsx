import { useEffect, useState } from "react";
import axios from "axios";
import "../Notes.css";

function App() {
  const [notes, setnotes] = useState([]);
  const [currnote, setcurrentnote] = useState(null);
  const loggedInUserName = JSON.parse(localStorage.getItem("user"));
  console.log(loggedInUserName.user.email);

  useEffect(() => {
    axios
      .get(`http://54.234.253.93/data?username=${loggedInUserName.user.email}`)
      .then((res) => {
        setnotes(res.data);
        setcurrentnote(res.data[0] || null);
      });
  }, []);

  return (
    <div style={{ paddingLeft: "5rem", paddingRight: "5rem" }}>
      <div className="container ">
        <div className="row ">
          <div className="col-3 mt-3 ">
            <div className="d-flex ">
              <h5 style={{ marginTop: "2rem", marginLeft: "0.3rem" }}>
                My Notes
              </h5>
              <i
                className="fa-solid fa-plus"
                style={{
                  marginInlineStart: "120px",
                  marginLeft: "10.4rem",
                  marginTop: "2.5rem",
                  color: "blue",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  const newNote = {
                    id: Number(Date.now()),
                    title: "Write your title",
                    content: "Write your content here",
                    author: loggedInUserName.user.email,
                  };

                  await axios.post("http://54.234.253.93/add", newNote);

                  setnotes([...notes, newNote]);
                  setcurrentnote(newNote);
                }}
              ></i>
            </div>
            <div className="mt-4 ">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`card mt-3  ${
                    currnote?.id === note.id ? "border-primary" : ""
                  }`}
                  style={{
                    width: "18rem",
                    height: "4.5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setcurrentnote(note)}
                >
                  <div
                    className="card-body"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "0px",
                    }}
                  >
                    <h6 className="card-title">{note.title}</h6>
                    <i
                      className="fa-solid fa-trash text-danger  box"
                      style={{ marginTop: "0.3rem" }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setnotes(notes.filter((n) => n.id !== note.id));
                        setcurrentnote(null);
                        await axios.delete(
                          `http://54.234.253.93/delete/${note.id}`,
                          currnote
                        );
                      }}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="col-9 mt-5 border "
            style={{
              opacity: "1",
              height: "25rem",
              width: "71%",
              marginLeft: "3rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
              // position: "fixed",

              backgroundColor: "white",
            }}
          >
            <div className="border-bottom">
              <div className="d-flex mt-4">
                <input
                  type="text"
                  value={currnote?.title || ""}
                  onChange={(e) =>
                    setcurrentnote({ ...currnote, title: e.target.value })
                  }
                  onBlur={async () => {
                    if (currnote) {
                      setnotes(
                        notes.map((note) =>
                          note.id === currnote.id ? { ...currnote } : note
                        )
                      );
                      await axios.put(
                        `http://54.234.253.93/update/${currnote.id}`,
                        currnote
                      );
                    }
                  }}
                  className="form-control"
                  style={{
                    marginLeft: "60px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    width: "20rem",
                    height: "2rem",
                    border: "none",
                    backgroundColor: "transparent",
                    paddingBottom: "1rem",
                    paddingTop: "0rem",
                  }}
                  disabled={!currnote}
                />
              </div>
            </div>
            <div className="mt-5">
              <textarea
                className="mb-3"
                style={{
                

                  height: "15rem",
                  borderColor: "gray",

                  borderRadius: "5px",
                  overflowY: "scroll",
                }}
                value={currnote?.content || ""}
                onChange={(e) =>
                  setcurrentnote({ ...currnote, content: e.target.value })
                }
                onBlur={async () => {
                  if (currnote) {
                    setnotes(
                      notes.map((note) =>
                        note.id === currnote.id ? { ...currnote } : note
                      )
                    );
                    await axios.put(
                      `http://54.234.253.93/update/${currnote.id}`,
                      currnote
                    );
                  }
                }}
                disabled={!currnote}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
