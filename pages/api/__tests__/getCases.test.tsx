const request = require('supertest');
import { apiResolver } from 'next/dist/server/api-utils/node';
import { IncomingMessage, ServerResponse, createServer } from "http";
import moment from "moment";
import getCasesHandler from "../getCases";
import type { NextApiRequest, NextApiResponse } from 'next'

/* TODO: how to call the function with query params

if I request with getCaseshandler, it calls the function but I cant pass in params (the url has the params but they are not in req.query)
maybe use express to mock everything?
is there a way to mock it all through jest?


*/


describe("GET /getCases", () => {
  const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    apiResolver(
      req,
      res,
      {
        dateRangeStart: moment().utc().toString(),
        dateRangeEnd: moment().utc().endOf('month').toString(),
        orderBy: 'asc'
      }, //props for query
      getCasesHandler,
      {
        previewModeEncryptionKey: "key",
        previewModeId: "id",
        previewModeSigningKey: "key",
      },
      false
    );
  };

//jest.spyOn(getCasesHandler, 'getCasesHandler').mockReturnValueOnce('hello');

  test("should call getCases handler and return data", async () => {
    const server = createServer(requestListener);
    const agent = await request.agent(server).get("/api/getCases");

    //expect(getCasesHandler).toHaveBeenCalledTimes(1);
    console.log('agent error', agent.error);
    //done();

    expect(agent.text).toBe(JSON.stringify({ message: "Hello, world." }));
  });
}); 


/* 
 // const testClient = (handler: NextApiHandler) => {
  //   const listener: RequestListener = (req, res) => {
  //     return apiResolver(
  //       req,
  //       res,
  //       undefined,
  //       handler,
  //       {
  //         previewModeEncryptionKey: "",
  //         previewModeId: "",
  //         previewModeSigningKey: "",
  //       },
  //       false
  //     );
  //   };
  
  //   return request(createServer(listener));
  // };
  
  // it("What's my name!?", async () => {
  //   const client = testClient(handler);
  //   const response = await client.get("/api/name").query({ name: "John" });
  
  //   console.log(response.body);
  
  //   expect(true);
  // });


    // test("getCases default landing page query", (done) => {
    //   request(getCasesHandler)
    //   .get('/api/getCases')
    //   .query({ 
    //       dateRangeStart: moment().utc().toString(), 
    //       dateRangeEnd: moment().utc().endOf('month').toString(), 
    //       orderBy: 'asc' 
    //     })
    //    .expect(200, function (err, res) {
    //        console.log('res',res);
    //         res.text.should.be.equal('Test1');
    //     done();
    //   });
    //   console.log('result', result);
    //   expect(result.text).toEqual("hello");
    //   expect(result.statusCode).toEqual(200);

*/
