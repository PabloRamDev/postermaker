import ImageForm from "./components/image-form"

function App() {

  return (

      <main className="container flex flex-col h-screen w-screen min-h-sreen min-w-screen gap-4 justify-center items-center">
        <h1 className="text-3xl font-bold">
        POSTER MAKER FRONT
        </h1>
        <p>Make simple multi sheet posters in seconds</p>
        <ImageForm />
      </main>
  )
}

export default App
