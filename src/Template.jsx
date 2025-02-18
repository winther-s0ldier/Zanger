import { useState } from "react";
import "./template.css";

export default function Template() {
  const [data, setdata] = useState([
    {
      id: 1,
      template: "Assignment of Copyright",
      content: "Template of Legal Agreement",
      icon: "fa-copyright",
    },
    {
      id: 2,
      template: "Consultancy Agreement",
      content: "Write the content you want to fill",
      icon: "fa-gavel",
    },
    {
      id: 3,
      template: "Distribution Agreement",
      content: "Write the content of client letter",
      icon: "fa-envelope",
    },
    {
      id: 4,
      template: "Foreign Trade Contract",
      content: "Write the content of Legal Notice",
      icon: "fa-exclamation-circle",
    },
    {
      id: 5,
      template: "Power of Attorney",
      content: "Write the template of Power of Attorney",
      icon: "fa-file-signature",
    },
    {
      id: 6,
      template: "Commission Agreement",
      content: "Write the template of Settle Agreement",
      icon: "fa-handshake",
    },
    {
      id: 7,
      template: "Manufacturing Agreement",
      content: "Write the template of Settle Agreement",
      icon: "fa-handshake",
    }
  ]);
  const [currtemplate, setcurrenttemplate] = useState(null);

  const handleTemplateClick = (template) => {
    setcurrenttemplate(template);
    if (template.template === "Assignment of Copyright") {
      window.open("https://zanger.onrender.com/", "_blank");
    }
  };

  return (
    <div className="container py-5" style={{ paddingLeft: "5rem", paddingRight: "5rem" }}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-1">Legal Document Templates</h4>
          <p className="text-muted">Select a template to get started</p>
        </div>
      </div>
      
      <div className="row g-4">
        {data.map((template) => (
          <div key={template.id} className="col-md-4">
            <div 
              className="card h-100 border-0 shadow-sm"
              style={{ 
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onClick={() => handleTemplateClick(template)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(128, 128, 128, 0.1)";
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ 
                      backgroundColor: "rgba(13, 110, 253, 0.1)",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <i className={`fas ${template.icon} text-primary fs-5`}></i>
                  </div>
                  <h5 className="card-title mb-0">{template.template}</h5>
                </div>
                <p className="card-text text-muted small">{template.content}</p>
                <div className="d-flex justify-content-end mt-3">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateClick(template);
                    }}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}
