import { FC, useContext, useEffect, useState } from 'react'

import { ErrorContext } from '../hooks/error'
import { ReloadContext } from '../hooks/dev'
import { useRequest } from '../tools'
import { DefaultLoading } from '../DefaultLoading'
import { ConfigContext } from '../hooks/config'

import { AnyCompList, FastProps } from './index'

export interface ServerLoadProps {
  type: 'ServerLoad'
  url: string
}

export const ServerLoadComp: FC<ServerLoadProps> = ({ url }) => {
  const [componentProps, setComponentProps] = useState<FastProps[] | null>(null)

  const { error, setError } = useContext(ErrorContext)
  const reloadValue = useContext(ReloadContext)
  const { rootUrl, pathSendMode, Loading } = useContext(ConfigContext)
  const request = useRequest()

  useEffect(() => {
    let fetchUrl = rootUrl
    if (pathSendMode === 'query') {
      fetchUrl += `?path=${encodeURIComponent(url)}`
    } else {
      fetchUrl += url
    }

    const promise = request({ url: fetchUrl })

    promise.then(([, data]) => setComponentProps(data as FastProps[]))

    return () => {
      promise.then(() => null)
    }
  }, [rootUrl, pathSendMode, url, setError, reloadValue, request])

  if (componentProps === null) {
    if (error) {
      return <></>
    } else if (Loading) {
      return <Loading />
    } else {
      return <DefaultLoading />
    }
  } else {
    return <AnyCompList propsList={componentProps} />
  }
}