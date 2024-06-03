import {json, LoaderFunctionArgs} from "@remix-run/node";
import {Ad, FakeSdk} from "~/fakeSdk";
import {useLoaderData} from "@remix-run/react";
import {useEffect, useState} from "react";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const fakeSdk = new FakeSdk({apiKey: 'apiKey', env: 'dev'}, request)
  const ad = fakeSdk.fetchAd('ssr-ad')
  const cookie = fakeSdk.makeJdidCookie()
  return json({ssrAdProps: ad.serialize(), jdid: cookie}, {headers: {'Set-Cookie': cookie}})
}

export default function Index() {
  const {ssrAdProps} = useLoaderData<typeof loader>()
  const [ssrAd] = useState<Ad>(new Ad(ssrAdProps))
  const [csrAd, setCsrAd] = useState<Ad>()

  useEffect(() => {
    const fakeSdk = new FakeSdk({apiKey: 'apiKey', env: 'dev'})
    setCsrAd(fakeSdk.fetchAd('csr-ad'))
  }, [])

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <AdComponent ad={ssrAd}/>
      {csrAd && <AdComponent ad={csrAd}/>}
    </div>
  )
}

interface AdComponentProps {
  ad: Ad
}
const AdComponent = ({ad}: AdComponentProps) => {
  return (<div style={{border: '1px solid black'}}>
    <p>
      adType: {ad.type}
      <br/>
      flightId: {ad.flight}
      <br/>
    </p>
    <button onClick={() => ad.impress(1)}>impress</button>
    <button onClick={() => ad.click(1)}>click</button>
  </div>)
}
