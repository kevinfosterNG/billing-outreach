import Link from 'next/link';

export default async function MessagesPage() {
  const res = await fetch('http://worldtimeapi.org/api/timezone/America/Chicago');
  const _time = await res.json();

  return (
      <div>
        <p>
          Messages
        </p>
        <div>
            <table>
                <thead><tr>
                    <th>HEADER1</th>
                    <th>HEADER2</th>
                    <th>HEADER3</th>
                    </tr></thead>
                <tbody>
                    <tr>
                      <td>
                      <Link href="./messages/a">a</Link>
                      </td>
                      <td>
                        <Link href="./messages/b">b</Link>
                      </td>
                      <td>
                      <Link href="/messages/c">c</Link>
                      </td>
                      </tr>
                </tbody>
            </table>
            <div className='bottom-date'>
              {_time.datetime} {_time.abbreviation}
            </div>
            <div className='bottom-ip'>
              {_time.client_ip}
            </div>
        </div>
      </div>
  )
}
