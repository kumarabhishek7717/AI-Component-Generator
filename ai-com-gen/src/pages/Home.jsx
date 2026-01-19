import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Select from 'react-select';
import Editor from '@monaco-editor/react';
import { BsStars } from "react-icons/bs";
import { HiCode } from "react-icons/hi";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCw } from "react-icons/fi";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { MdClose } from "react-icons/md";

const Home = () => {
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  const extractCode = (response) => {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };
const getResponse = async () => {
  setLoading(true);
  try {
    const res = await fetch("https://ai-comp-gen-backend.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, framework: frameWork })
    });
    if (!res.ok) throw new Error("API fetch failed");
    const data = await res.json();
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
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy!");
    }
  };

  const downloadFile = () => {
    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center px-[100px] justify-between gap-[30px]">
        {/* Left Panel */}
        <div className="left w-[50%] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className="text-[25px] font-semibold sp-text">AI Component Generator</h3>
          <p className="text-gray-400 mt-2 text-[16px]">
            Describe your component and let AI code it for you.
          </p>

          <p className="text-[15px] font-bold mt-4">Framework</p>
          <Select
            className="mt-2"
            options={options}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: state.isFocused ? "#555" : "#333",
                color: "#fff",
                boxShadow: "none",
                "&:hover": { borderColor: "#555" },
              }),
              menu: (base) => ({ ...base, backgroundColor: "#111", border: "1px solid #333" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "#333" : state.isFocused ? "#222" : "#111",
                color: "#fff",
                cursor: "pointer",
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#777" }),
              input: (base) => ({ ...base, color: "#fff" }),
              dropdownIndicator: (base, state) => ({
                ...base,
                color: state.isFocused ? "#fff" : "#777",
                "&:hover": { color: "#fff" },
              }),
              indicatorSeparator: () => ({ display: "none" }),
            }}
            onChange={(e) => setFrameWork(e.value)}
          />

          <p className="text-[15px] font-bold mt-5">Describe your component</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[250px] rounded-xl bg-[#09090B] mt-3 p-[10px]"
            placeholder="Describe your component in detail and let AI code it."
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-400">Click generate to create your code</p>
            <button
              onClick={getResponse}
              className="generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-[20px] gap-[10px] transition-all hover:opacity-80"
            >
              {loading ? <ClipLoader color="white" size={20} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right relative mt-2 w-[50%] h-[80vh] bg-[#141319] rounded-xl">
          {!outputScreen ? (
            <div className="skeleton w-full h-full flex flex-col items-center justify-center">
              <div className="circle w-[70px] h-[70px] flex items-center justify-center text-[30px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                <HiCode />
              </div>
              <p className="text-[16px] text-gray-400 mt-3">Your component & code will appear here.</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="top bg-[#17171C] w-full h-[60px] flex items-center gap-[15px] px-[20px]">
                <div
                  onClick={() => setTab(1)}
                  className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 1 ? "bg-[#333]" : ""}`}
                >
                  Code
                </div>
                <div
                  onClick={() => setTab(2)}
                  className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 2 ? "bg-[#333]" : ""}`}
                >
                  Preview
                </div>
              </div>

              {/* Toolbar */}
              <div className="top-2 bg-[#17171C] w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
                <p className="font-bold">Code Editor</p>
                <div className="flex items-center gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button className="copy w-[40px] h-[40px] rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]" onClick={copyCode}>
                        <IoCopy />
                      </button>
                      <button className="export w-[40px] h-[40px] rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]" onClick={downloadFile}>
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="copy w-[40px] h-[40px] rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]" onClick={() => setIsNewTabOpen(true)}>
                        <ImNewTab />
                      </button>
                      <button className="export w-[40px] h-[40px] rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]">
                        <FiRefreshCw />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editor / Preview */}
              <div className="editor h-full">
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme="vs-dark" defaultLanguage="html" />
                ) : (
                  <iframe srcDoc={code} className="preview w-full h-full" />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Tab Preview */}
      {isNewTabOpen && (
        <div className="container absolute left-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto">
          <div className="top text-black w-full h-[60px] flex items-center justify-between px-[20px]">
            <p className="font-bold">Preview</p>
            <button className="copy w-[40px] h-[40px] rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]" onClick={() => setIsNewTabOpen(false)}>
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-full" />
        </div>
      )}
    </>
  );
};

export default Home;
