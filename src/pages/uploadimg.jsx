function img(){
        const [file,setfile] = useState();
      const handleinput=(e)=>{

        const formdata =new FormData()
        formdata.append('file',file)
         axios.post('http://localhost:3001/upload',formdata)
         .then(res=>console.log(res))
         .catch(err =>console.log(err))
        //console.log(file);
      }
      useEffect(()=>{
        axios.get('http://localhost:3001/getimage')
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