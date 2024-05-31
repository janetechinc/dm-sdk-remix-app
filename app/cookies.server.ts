import {createCookie} from "@remix-run/node";

export const jdid = createCookie('jdid', {maxAge: 604_800})