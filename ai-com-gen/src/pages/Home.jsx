import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import Editor from "@monaco-editor/react";
import { BsStars } from "react-icons/bs";
import { HiCode } from "react-icons/hi";
import { IoCopy, IoCloseSharp } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCw } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0].value);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const extractCode = (response) => {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };

  const getResponse = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://ai-comp-gen-backend.onrender.com/api/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, framework: frameWork }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong!");
        return;
      }

      setCode(extractCode(data.code));
      setOutputScreen(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "GenUI-Code.html";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("File downloaded");
  };

  const openNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write(code);
    newWindow.document.close();
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center px-[100px] justify-between gap-[30px]">
        
        <div className="w-[50%] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className="text-[25px] font-semibold sp-text">AI Component Generator</h3>
          <p className="text-gray-400 mt-2 text-[16px]">
            Describe your component and let AI code it for you.
          </p>

          <p className="text-[15px] font-bold mt-4">Framework</p>
          <Select
            className="mt-2"
            options={options}
            defaultValue={options[0]}
            onChange={(e) => setFrameWork(e.value)}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                color: "#fff",
                boxShadow: "none",
              }),
              menu: (base) => ({ ...base, backgroundColor: "#111", border: "1px solid #333" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                  ? "#222"
                  : "#111",
                color: "#fff",
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#777" }),
              input: (base) => ({ ...base, color: "#fff" }),
              dropdownIndicator: (base) => ({ ...base, color: "#fff" }),
              indicatorSeparator: () => ({ display: "none" }),
            }}
          />

          <p className="text-[15px] font-bold mt-5">Describe your component</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[250px] rounded-xl bg-[#09090B] mt-3 p-[10px]"
            placeholder="Describe your component in detail and let AI code it."
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-400">Click Generate to create your code</p>
            <button
              onClick={getResponse}
              className="flex items-center p-[15px] rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 gap-[10px] hover:opacity-80 transition-all"
            >
              {loading ? <ClipLoader color="white" size={20} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

       
        <div className="relative w-[50%] h-[80vh] bg-[#141319] rounded-xl mt-2">
          {!outputScreen ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-[30px]">
                <HiCode />
              </div>
              <p className="mt-3 text-gray-400 text-[16px]">
                Your component & code will appear here.
              </p>
            </div>
          ) : (
            <>
             
              <div className="flex w-full h-[60px] bg-[#17171C] gap-[15px] px-[20px] items-center">
                <div
                  onClick={() => setTab(1)}
                  className={`w-[50%] p-[10px] rounded-xl cursor-pointer ${
                    tab === 1 ? "bg-[#333]" : ""
                  }`}
                >
                  Code
                </div>
                <div
                  onClick={() => setTab(2)}
                  className={`w-[50%] p-[10px] rounded-xl cursor-pointer ${
                    tab === 2 ? "bg-[#333]" : ""
                  }`}
                >
                  Preview
                </div>
              </div>

            
              <div className="flex justify-between items-center h-[60px] bg-[#17171C] px-[20px]">
                <p className="font-bold">Code Editor</p>
                <div className="flex gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button
                        className="w-[40px] h-[40px] rounded-xl border flex items-center justify-center hover:bg-[#333]"
                        onClick={copyCode}
                      >
                        <IoCopy />
                      </button>
                      <button
                        className="w-[40px] h-[40px] rounded-xl border flex items-center justify-center hover:bg-[#333]"
                        onClick={downloadFile}
                      >
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-[40px] h-[40px] rounded-xl border flex items-center justify-center hover:bg-[#333]"
                        onClick={openNewTab}
                      >
                        <ImNewTab />
                      </button>
                      <button className="w-[40px] h-[40px] rounded-xl border flex items-center justify-center hover:bg-[#333]">
                        <FiRefreshCw />
                      </button>
                    </>
                  )}
                </div>
              </div>

            
              <div className="h-full">
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme="vs-dark" defaultLanguage="html" />
                ) : (
                  <iframe srcDoc={code} className="w-full h-full" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
