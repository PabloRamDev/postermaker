import { Dropzone } from "./components/ui/shadcn-io/dropzone"

function App() {

  return (
    <>
      <main className="dark flex flex-col h-screen w-screen min-h-sreen min-w-screen bg-default-background text-default-font font-caption">
        <h1 className="text-3xl">
        POSTER MAKER FRONT
        </h1>
        <Dropzone />
        <p>hola</p>
      </main>
    </>
  )
}

export default App
