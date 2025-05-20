import { Button } from "ui";
import { trpc } from "../utils/trpc";
import Link from "next/link";

export default function Web() {
  const health = trpc.health.health.useQuery();
  const res = trpc.example.greeting.useQuery({ name: 'John' });
  const resFiles = trpc.example.getFiles.useQuery();

  console.log(resFiles.data);

  function handleDelete(id: string): void {
    trpc.example.deleteFile.useQuery({ id });
  }

  return (
    <div>
      {health.data && <p>TRPC Health: {health.data.health}</p>}
      {res.data && <p>Hello: {res.data}</p>}
      {resFiles.data && <div>
        <p>Files: </p>
        <table>
          <thead>
            <tr>
              <th>file</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {resFiles.data.map((file: any) => (
              <tr key={file.id}>
                <td>
                  {file.name}
                </td>
                <td>
                  <button className="btn btn-red" onClick={() => handleDelete(file.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>}
    </div>
  );
}
