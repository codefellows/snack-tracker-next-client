import fetchResource, { logIn } from '../services/data-fetcher'

async function logInHandler() {

    const loggedIn = await logIn("jb","jb");

    if(loggedIn) {
        console.log('yay');
    } else {
        console.log('sad');
    }

}

async function getSnacksHandler() {
    const snacks = await fetchResource('snacks');
    console.log('snacks', snacks);
}


export default function Home() {
  return (
    <div>
        <button onClick={logInHandler}>Log In</button>
        <button onClick={getSnacksHandler}>Get Snacks</button>
    </div>
  )
}

