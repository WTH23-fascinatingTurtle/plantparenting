import { Inter } from 'next/font/google'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [ plantKey, setPlantKey ] = useState("")
  const [ errorMsg, setErrorMsg ] = useState("")
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()

    axios.get(`https://plantparenting-o6blkvgghq-an.a.run.app/api/plants?id=${plantKey}`)
    .then(function (res) {
      if (res.status === 200) {
        if (res.data.totalPlants === 0) {
          setErrorMsg("Plant Device Key does not exist! Try double checking if you have inputted it correctly!")
        } else {
          axios.get(`/api/setCookie?name=plantKey&value=${plantKey}`)
            .then(function (res) {
              router.push("dashboard")
            })
        }
      }
    })
  }
 
  return (
    <main
      className={`absolute flex h-full w-full ${inter.className} bg-backgroundred`}
    >
      <div className="h-full w-full flex-grow p-10">
        <h1 className="text-title font-extrabold text-5xl mb-10">Find My Plant</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="key"
            id="key"
            placeholder="Enter your plant key"
            className=" mb-5 flex h-20 w-1/3 flex-shrink-0 bg-primary rounded-md px-2 shadow-xl text-whiteh placeholder-primarytext focus:outline-none"
            value={plantKey}
            onChange={(e) => setPlantKey(e.target.value)}
          />
          <input
              type="submit"
              value="Next >"
              className="flex-shrink-0 rounded-md bg-secondary px-5 py-3 font-bold text-white duration-75 hover:cursor-pointer focus:outline-none active:scale-95 shadow"
            />
        </form>
        
        {errorMsg !== "" ? 
        <div classname="">
          <h2 className="mt-8 text-white rounded-lg bg-red-400 border-2 border-red-800 p-2">{errorMsg}</h2>
        </div> : <></>}
      </div>
    </main>
  )
}
