import { expect, describe, it } from "vitest";

describe("connection management", () => {
  it("check 1+1", async () => {
    expect(1 + 1).toBe(2);
  });
});

//     it.sequential.todo("lock a session", async () => {
//       // Should forget the access token
//     });

//     it.sequential.todo("forget the private key #0", async () => {
//       // Should be able to forget the private key #0
//     });

//     it.sequential.todo("forget the private key #1", async () => {
//       // Should be able to forget the private key #1
//     });
//   });
