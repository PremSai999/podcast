import React from "react";
import { useState, useEffect } from "react";
import * as Realm from "realm-web";

const App = ()=>{
    const REALM_ID = "audis-rnyow";
    const app = new Realm.App({id:REALM_ID});
    const cred = Realm.Credentials.anonymous();
    const [dbData, setdbData] = useState([]);
    useEffect(() => {
        async function func() {
            const REALM_ID = "audis-rnyow";
            const app = new Realm.App({id:REALM_ID});
            const cred = Realm.Credentials.anonymous();
        try{
            const user = await app.logIn(cred);
            const allData = await user.functions.getAllAudios();
            setdbData(allData);
        }
        catch(error){
            console.log(error);
        }
        }
        func();
    },[])

    async function uploadAudio() {
        const fileInput = document.getElementById("audioFile");
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const dataUrl = reader.result;
                console.log(dataUrl)
                const base64 = dataUrl.split(",")[1];
                console.log(base64)
                try {
                    const user = await app.logIn(cred);
                    await user.functions.addAudio(base64,file.name);
                    const allData = await user.functions.getAllAudios();
                    setdbData(allData);
                    console.log(allData);
                } catch (error) {
                    console.log(error);
                }
            };
        }
    }

    

    return(
        <>  
            <h1>Audio Player</h1>
            <label htmlFor="audioFile">Upload Audio File:</label>
            <input type="file" id="audioFile" name="audioFile" accept="audio/*" />
            <button onClick={uploadAudio}>Upload Audio</button>
            {dbData && dbData.map((val,ind) => {
                return <Songs name={val.name} audio={val.audio} id={val._id}/>
            })}
        </>
    );
}

function Songs(props){
     function playAudio(source) {
        const binaryString = atob(source);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audioPlayer = document.getElementById(props.id);
    audioPlayer.src = url;
    audioPlayer.play();
    // const audio = new Audio(url);
    // audio.play();
    }
    return(
        <>
            <br />
            <button htmlFor={props.id} onClick={() => playAudio(props.audio)}>{props.name}</button>
            <audio id={props.id} controls></audio>    
        </>
    );
}
export default App;