import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from "react-icons/bs";
import { HiCode } from "react-icons/hi";
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
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

  function extractCode(response) {
    // Regex se triple backticks ke andar ka content nikal lo
    const match = response.match(/```(?:\w+)?\n?([\s\s]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
 async function getResponse() {
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        framework: frameWork.value,
      }),
    });

    const data = await res.json();
    setCode(extractCode(data.code));
    setOutputScreen(true);
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
}

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard')
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy0");
    }

  };

  const downloadFile = () => {
    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type:'text/plain'});
    let url =  URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('File download');
  }



  return (
    <>
      <Navbar />
      <div className='flex items-center px-[100px] justify-between gap-[30px]'>
        <div className="left w-[50%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">

          <h3 className='text-[25px] font-semibold sp-text'>AI component generator</h3>
          <p className='text-[gray] mt-2 text-[16px]'>Describe your component and let AI will code for you.</p>
          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: state.isFocused ? "#555" : "#333",
                color: "#fff",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#555",
                },
              }),

              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                border: "1px solid #333",
              }),

              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                    ? "#222"
                    : "#111",
                color: "#fff",
                cursor: "pointer",
              }),

              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),

              placeholder: (base) => ({
                ...base,
                color: "#777",
              }),

              input: (base) => ({
                ...base,
                color: "#fff",
              }),

              dropdownIndicator: (base, state) => ({
                ...base,
                color: state.isFocused ? "#fff" : "#777",
                "&:hover": {
                  color: "#fff",
                },
              }),

              indicatorSeparator: () => ({
                display: "none",
              }),

            }}
            onChange={(e) => {
              setFrameWork(e.value)

            }}
          />
          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea onChange={(e) => { setPrompt(e.target.value) }} value={prompt} className='w-full min-h-[250px] rounded-xl bg-[#09090B] mt-3 p-[10px]' placeholder='Describe your component in detail and let ai will code for your component.'></textarea>
          <div className='flex items-center justify-between'>
            <p className='text-[gray]'>Click on generate button to generate your code</p>
            <button  onClick={getResponse} className='generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400  to-purple-600 mt-3 px-[20px] gap-[10px] transition-all hover:opacity-[.8]'>
              {
                loading === false ?
                <>
               <i><BsStars /></i>
                </> : ""
              }
             
             {
                  loading === true ?
                    <>
                       
                        <ClipLoader  color='white' size={20} />
                      

                    </> : ""
                }
            Generate</button>
          </div>
        </div>
        <div className="right relative mt-2 w-[50%] h-[80vh] bg-[#141319] rounded-xl">
          {

            outputScreen === false ?
              <>
               

                <div className='skeleton w-full h-full flex items-center flex-col justify-center'>
                  <div className="circle p-[20px] w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-[50%] bg-gradient-to-r from-purple-400 to-purple-600"><HiCode /></div>
                  <p className='text-[16px] text-[gray] mt-3'>Your component & code will appear here.</p>
                </div>
              </> : <>
                <div className="top bg-[#17171C] w-full h-[60px] flex items-center gap-[15px] px-[20px]">

                  <div onClick={() => { setTab(1) }} className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${tab === 1 ? "bg-[#333]" : ""}`}>Code</div>
                  <div onClick={() => { setTab(2) }} className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${tab === 2 ? "bg-[#333]" : ""}`}>Preview</div>
                </div>
                <div className="top-2 bg-[#17171C] w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
                  <div className="left">
                    <p className='font-bold'>
                      Code Editor
                    </p>
                  </div>
                  <div className="right flex items-center gap-[10px]">
                    {
                      tab === 1 ?
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                          <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><PiExportBold /></button>
                        </>
                        :
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={()=>{setIsNewTabOpen(true)}}><ImNewTab /></button>
                          <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"><FiRefreshCw /></button>

                        </>
                    }


                  </div>

                </div>
                <div className="editor h-full">
                  {
                    tab === 1 ?
                      <>
                        <Editor value={code} height="100%" theme='vs-dark' defaultLanguage="html" />
                      </> :
                      <>
                        <iframe  srcDoc={code} className='preview w-full h-full bg-white text-black flex items-center justify-center'>
                        </iframe>
                      </>
                  }
                </div>

              </>
          }
        </div>
      </div>

      {
        isNewTabOpen === true ?
        <>
        <div className="container absolute left-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto">
          <div className='top text-black w-full h-[60px] flex items-center justify-between px-[20px]'>
            <div className="left">
              <p className='font-bold'>preview</p>
            </div>
            <div className="right flex items-center gap-[10px]">
              <button className='copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]'onClick={() => {setIsNewTabOpen(false)}}><IoCloseSharp /></button>
            </div>
          </div>
        <iframe srcDoc= {code} className='w-full h-full '>
          
        </iframe>
        </div>
        <div className ='close absolute top-[100px] right-[100px] w-[50px] h-[50px] flex items-center justify-center rounded-[50%] bg-[#333] cursor-pointer'><MdClose /></div>
        
        </>
        : ""
      }

    </>
  )
}
export default Home
