import { Button } from "ui";
import { trpc } from "../utils/trpc";

export default function Web() {
  const health = trpc.health.health.useQuery();
  const res = trpc.example.greeting.useQuery({ name: 'John' });

  return (
    <div>
      {health.data && <p>TRPC Health: {health.data.health}</p>}
      {res.data && <p>Hello: {res.data}</p>}
      <h1>Web</h1>
      <Button />
    </div>
  );
}
