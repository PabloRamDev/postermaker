

interface textSectionProps {
    isDirty: boolean;
    isSubmitSuccessful: boolean;
}
export default function TextSection({isDirty, isSubmitSuccessful} : textSectionProps) {
  return (
              <section className="flex flex-col justify-center w-full gap-2 items-center">
            <h1 className="text-3xl lg:text-5xl font-black">P O S T E R M A K E R</h1>
            {isDirty ?             (
              <>
                <p className=" flex flex-col text-center text-xl font-semibold">
                  Previsualización
                  <span className="font-light text-muted-foreground text-sm">
                    los márgenes dependerán de su configuración de impresión
                  </span>
                </p>
              </>
            )  : isSubmitSuccessful ? (
              <>
                <p className=" flex flex-col text-center text-xl font-semibold">
                  Éxito
                  <span className="font-light text-muted-foreground text-sm">
                    Su póster está listo para ser descargado
                  </span>
                </p>
              </>
            ) :
            (
              <p className="text-center text-xl font-light">
                Sube una imagen y crea un poster para imprimir
              </p>
            ) 
            }
          </section>
  )
}
