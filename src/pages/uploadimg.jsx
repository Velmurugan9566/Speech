function img(){
        const [file,setfile] = useState();
      const handleinput=(e)=>{
        const formdata =new FormData()
        formdata.append('file',file)
         axios.post(`${import.meta.env.VITE_API_URL}/upload`,formdata)
         .then(res=>console.log(res))
         .catch(err =>console.log(err))
        //console.log(file);
      }
      useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API_URL}/getimage`)
        .then(res=>console.log(res))
        .catch(err =>console.log(err))
      },[])
     return(
        <>
          <input type="file" onChange={e=>setfile(e.target.files[0])} placeholder='select file'></input>
         <button onClick={handleinput}>Upload</button>
        </>
     )
    }