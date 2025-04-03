import QRCode from "qrcode";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Qrgenerater.css";
import "../Styles/Report.css";

const QrGenerate = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [qr, setQr] = useState("");

  const generateQrCode = async () => {
    if (!vehicleNo) {
      toast.error("Please enter a vehicle number.");
      return;
    }
    try {
      const qrDataUrl = await QRCode.toDataURL(vehicleNo, { width: 300, height: 300 }); // Increased size
      setQr(qrDataUrl);
      toast.success("QR Code generated successfully!");
    } catch (error) {
      console.error("Error generating QR Code: ", error);
      toast.error("Failed to generate QR Code.");
    }
  };
  
  const downloadQrCode = () => {
    if (!qr) {
      toast.error("No QR code to download.");
      return;
    }
    const link = document.createElement("a");
    link.href = qr;
    link.download = `QR_Codes/${vehicleNo}_QRCode.png`; // Suggested path (browser will still ask where to save)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setVehicleNo("");
    setQr("");
    // toast.info("Form reset successfully!");
  };

  return (
    <div className="report-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="filter-form">
        <div className="filter-row">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Vehicle No"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>
        </div>
        
        <button onClick={generateQrCode} className="search-btn">Generate QR</button>
        <button onClick={resetForm} className="reset-btn">Reset</button>
      </div>
      
      {qr && (
        <div className="qr-container">
          <img src={qr} alt="Generated QR Code" />
          <button onClick={downloadQrCode} className="download-btn">Download QR</button>
        </div>
      )}
    </div>
  );
};

export default QrGenerate;
