import { Head } from '../Head'
export const CenteredLayout = ({ children, title }) => {
  return (
    <>
      <Head title={title} />
      <div className="h-dvh w-full grid">
        <div className="flex justify-center items-center">
          {children}
        </div>
      </div>
    </>
  )
}
