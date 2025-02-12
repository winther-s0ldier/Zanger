import { useState } from "react";
import "./template.css";
export default function Template() {
  let [data, setdata] = useState([
    {
      id: 1,
      template: "Assignment of Copyright",
      content: "Template of Legal Agreement",
    },
    {
      id: 2,
      template: "Court Filing",
      content: "Write the content you want to fill",
    },
    {
      id: 3,
      template: "Client Letter",
      content: "Write the content of client letter",
    },
    {
      id: 4,
      template: "Legal Notice",
      content: "Write the content of Legal Notice",
    },
    {
      id: 5,
      template: "Power of Attorney",
      content: "Write the template of Power of Attorney",
    },
    {
      id: 6,
      template: "Settle Agreement",
      content: "Write the template of Settle Agreement",
    },
  ]);
  let [currtemplate, setcurrenttemplate] = useState(null);

  const handleTemplateClick = (val) => {
    setcurrenttemplate(val);
    if (val.template === "Assignment of Copyright") {
      // Open the Flask template in a new window
      window.open("https://zanger.onrender.com/", "_blank");
    }
  };

  return (
    <div style={{ paddingLeft: "5rem", paddingRight: "5rem" }}>
      <div className="container">
        <div className="row">
          <div
            className="col-3 mt-5 border p-1"
            style={{
              borderRadius: "1.2rem",
              width: "17rem",
              height: "23rem",
              boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
              backgroundColor: "white",
            }}
          >
            <div className="p-6 pt-0 p-4">
              <h5 className="font-medium text-gray-900 mb-4 border-bottom p-2">
                Template Type
              </h5>
              {data.map((val) => (
                <div
                  key={val.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTemplateClick(val)}
                >
                  <span className="text-sm text-gray-700 text-muted">
                    <i className="fa-solid fa-note-sticky"></i> {val.template}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="col-9 mt-5 border"
            style={{
              marginLeft: "3rem",
              height: "25rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 15px rgba(128, 128, 128, 0.1)",
              backgroundColor: "white",
            }}
          >
            <div
              className="mt-3 border-bottom p-3"
              style={{ marginLeft: "2rem" }}
            >
              <h6>Template Generator</h6>
              <p className="text-muted">AI-assisted document generation</p>
              <div style={{ marginLeft: "70%", marginTop: "-3rem" }}>
                <button type="button" className="btn btn-primary">
                  Preview
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginLeft: "0.3rem" }}
                >
                  Generate
                </button>
              </div>
            </div>
            <div className="mt-4">
              <textarea
                value={currtemplate?.content || ""}
                onChange={(e) =>
                  setcurrenttemplate({
                    ...currtemplate,
                    content: e.target.value,
                  })
                }
                onBlur={() => {
                  if (currtemplate) {
                    setdata(
                      data.map((val) =>
                        val.id === currtemplate.id ? { ...currtemplate } : val
                      )
                    );
                  }
                }}
                style={{
                  height: "14rem",
                  width: "50rem",
                  marginLeft: "5rem",

                  borderRadius: "0.5rem",
                  borderColor: "gray",

                  resize: "vertical",
                }}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
