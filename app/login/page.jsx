import Login from "../../components/LoginForm";

export const metadata = {
  title: "Login - MixTube",
  description: "Login to MixTube",
  keywords: "login, mixtape, music, dj mix, dj, dj mixtape, dj mixtapes, dj mixtapes, dj mixtape, dj mixtapes",
}
export default function Home() {
  return (
    <>
      <main className="">
      <Login />
      </main>
    </>
  );
}