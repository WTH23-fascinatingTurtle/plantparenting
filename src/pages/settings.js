import { Inter } from 'next/font/google'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'

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
        <h1 className="text-title font-extrabold text-5xl mb-10">Settings - PlantName</h1>
        
        <h3 class="mb-5 text-3xl font-medium leading-tight text-primary flex items-left justify-left">Unique Key: aJk8nmp3</h3>
        <h3 class="mb-5 text-3xl font-medium leading-tight text-primary flex items-left justify-left">Plant Name: PlantName</h3>
        <h3 class="mb-5 text-3xl font-medium leading-tight text-primary flex items-left justify-left">ph Visual Type:</h3>
        <h3 class="mb-5 text-3xl font-medium leading-tight text-primary flex items-left justify-left">Light Intensity Visual Type: </h3>
        <h3 class="mb-5 text-3xl font-medium leading-tight text-primary flex items-left justify-left">Moisture Visual Type:</h3>
        <h3 class="mb-5 text-3xl font-medium leading-tight text-primary flex items-left justify-left">Humidity Visual Type:</h3>
        <h3 class="mb-5 text-3xl font-medium leading-tight text-primary flex items-left justify-left">Temperature Type:</h3>
        <h3 class="mb-5 text-3xl font-medium leading-tight text-primary flex items-left justify-left">Auto Water:</h3>

        <Link href = '/'>
            <h2>Home</h2>
        </Link>

        <Link href = '/settings'>
            <h2>Settings</h2>
        </Link>

        <Link href = '/dashboard'>
            <h2>Dashboard</h2>
        </Link>
      </div>
    </main>
  )
}
