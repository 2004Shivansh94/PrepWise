import { POST } from './app/api/vapi/generate/route';

async function test() {
  const req = new Request('http://localhost/api/vapi/generate', {
    method: 'POST',
    body: JSON.stringify({
      message: {
        toolCalls: [
          {
            id: 'call_123',
            function: {
              name: 'generateInterview',
              arguments: JSON.stringify({
                role: 'Frontend',
                level: 'Junior',
                type: 'Technical',
                techstack: 'React',
                amount: 5,
                userid: 'test_user_id'
              })
            }
          }
        ]
      }
    })
  });
  const res = await POST(req);
  console.log(await res.json());
}
test();
