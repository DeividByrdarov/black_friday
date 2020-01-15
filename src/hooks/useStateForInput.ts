import { useState, ChangeEvent } from "react"

const useStateForInput = (
  initialValue: string | number = "",
): [string | number, (e: ChangeEvent<HTMLInputElement>) => void, (value: string | number) => void] => {
  const [data, setData] = useState(initialValue)

  return [data, (e: ChangeEvent<HTMLInputElement>) => setData(e.target.value), value => setData(value)]
}

export default useStateForInput