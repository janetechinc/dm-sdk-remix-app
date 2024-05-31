import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Ad, FakeSdk} from "~/fakeSdk";
import {useLoaderData} from "@remix-run/react";
import {jdid} from "~/cookies.server";

// GET to this route
export const loader = async ({request}: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const jdidCookie = (await jdid.parse(cookieHeader)) || {}
  console.log(cookieHeader)
  const fakeSdk = new FakeSdk({apiKey: 'apiKey', env: 'dev'})
  const ad = fakeSdk.fetchAd('cool-ad-type')
  return json({adProps: ad.serialize(), jdid: jdidCookie.jdid})
}

// POST to this route
export const action = async ({}: ActionFunctionArgs) => {
  return null
}

export default function Index() {
  const {adProps} = useLoaderData<typeof loader>()
  const ad = new Ad(adProps)
  return (<p id="index-page">
      {ad.type}
      <br/>
      {ad.flight}
      <br/>
      <button onClick={() => ad.impress(1)}>impress</button>
      <button onClick={() => ad.click(1)}>click</button>
    </p>)
}