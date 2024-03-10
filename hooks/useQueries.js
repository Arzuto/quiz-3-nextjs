import { useState,useCallback, useEffect } from "react"

export const useQueries = ({ prefixUrl = ""} = {}) => {
  const [data, setData] = useState({
    data: null,
    isLoading: true,
    isError: false
  })

  const fetchingData = useCallback(async ({ url="", method="GET" } = {}) => {

    try {
      const response = await fetch(url, {method})
      const result = await response.json()
      setData({
        ...data,
        data: result,
        isLoading: false,
      })
    } catch (error) {
      setData({
        ...data,
        isError: true,
        isLoading:false
      })
    }
  }, [])

  useEffect (() => {
    if (prefixUrl){
      fetchingData({url: prefixUrl})
    }
  },[])

  return {...data}
}