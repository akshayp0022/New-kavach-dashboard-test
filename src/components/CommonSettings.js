import React, { useState } from "react";
import CaptureScreenshot from "./commonSettings/CaptureScreenshot";
import WebsiteSettings from "./commonSettings/WebsiteSettings";
import WallpaperSettings from "./commonSettings/WallpaperSettings";
import "../css/CommonSettings.css";
import FeatureSettings from "./commonSettings/FeatureSettings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("featureSettings");

  // Content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "featureSettings":
        return <FeatureSettings />;
      case "captureScreenshot":
        return <CaptureScreenshot />;
      case "websiteSettings":
        return <WebsiteSettings />;
      case "wallpaper":
        return <WallpaperSettings />;
      default:
        return <div>Select a setting</div>;
    }
  };

  return (
    <div className="settings-container">
      <div className="sidebar">
      <button
          className={`tab ${activeTab === "featureSettings" ? "active" : ""}`}
          onClick={() => setActiveTab("featureSettings")}
        >
          feature Settings 
        </button>
        <button
          className={`tab ${activeTab === "captureScreenshot" ? "active" : ""}`}
          onClick={() => setActiveTab("captureScreenshot")}
        >
          Capture Screenshot
        </button>
        <button
          className={`tab ${activeTab === "websiteSettings" ? "active" : ""}`}
          onClick={() => setActiveTab("websiteSettings")}
        >
          Website Settings
        </button>
        <button
          className={`tab ${activeTab === "wallpaper" ? "active" : ""}`}
          onClick={() => setActiveTab("wallpaper")}
        >
          Wallpaper
        </button>
      </div>
      <div className="content-area">{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
