import { Inter } from 'next/font/google'
import axios from 'axios'
import Link from 'next/link'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Settings({ plant }) {
  return (
    <main
      className={`absolute flex h-full w-full ${inter.className} bg-backgroundred`}
    >
      <Head>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div className="h-full w-full flex-grow p-10">
        <div className="flex flex-row mb-10 gap-x-6">
          <Link href="/dashboard">
            <button>
              <img className="back-icon" src="/back.png" alt="back" />
            </button>
          </Link>
          <h1 className="text-title font-extrabold text-5xl">Settings - PlantName</h1>
        </div>
        
        <div className='bg-primary p-10 pl-20 pr-20 items-center flex flex-row rounded-3xl shadow-lg'>
          <div>
            <h3 className="mb-5 text-2xl font-medium leading-tight text-primarytext flex items-left justify-left">Unique Key:</h3>
            <h3 className="mb-5 text-2xl font-medium leading-tight text-primarytext flex items-left justify-left">Plant Name:</h3>
            <h3 className="mb-5 text-2xl font-medium leading-tight text-primarytext flex items-left justify-left">ph Visual Type:</h3>
            <h3 className="mb-5 text-2xl font-medium leading-tight text-primarytext flex items-left justify-left">Light Intensity Visual Type: </h3>
            <h3 className="mb-5 text-2xl font-medium leading-tight text-primarytext flex items-left justify-left">Moisture Visual Type:</h3>
            <h3 className="mb-5 text-2xl font-medium leading-tight text-primarytext flex items-left justify-left">Humidity Visual Type:</h3>
            <h3 className="mb-5 text-2xl font-medium leading-tight text-primarytext flex items-left justify-left">Temperature Type:</h3>
            <h3 className="mb-5 text-2xl font-medium leading-tight text-primarytext flex items-left justify-left">Auto Water:</h3>
          </div>
          <div className='ml-auto items-end'>
            <h3 class="mb-5 text-2xl leading-tight text-primarytext">{plant.hash}</h3>
            <h3 class="mb-5 text-2xl leading-tight text-primarytext">{plant.name}</h3>
            <h3 class="mb-5 text-2xl leading-tight text-primarytext">Line</h3>
            <h3 class="mb-5 text-2xl leading-tight text-primarytext">Line</h3>
            <h3 class="mb-5 text-2xl leading-tight text-primarytext">Line</h3>
            <h3 class="mb-5 text-2xl leading-tight text-primarytext">Line</h3>
            <h3 class="mb-5 text-2xl leading-tight text-primarytext">Line</h3>
            <h3 class="mb-5 text-2xl leading-tight text-primarytext">Yes</h3>
          </div>
        </div>
      </div>
    </main>
  )
}

export async function getServerSideProps({ req, res }) {
  const plantKey = req.headers.cookie
  ?.split(';')
  .find((cookie) => cookie.trim().startsWith('plantKey='))
  ?.split('=')[1] || '';		
  if (plantKey === undefined) {
      console.error("Plant Key returned undefined");
  }

  let plant
  await axios.get(`https://plantparenting-o6blkvgghq-an.a.run.app/api/plants?id=${plantKey}`).then(function (res) {
    plant = res.data.plants[0]
  })

  return {
      props: {
          plant
      }
  }
}