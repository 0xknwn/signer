import fs from "fs";
import { content as accounts } from "../src/routes/accounts.help";
import { content as login } from "../src/routes/login.help";
import { content as messages } from "../src/routes/messages.help";
import { content as more } from "../src/routes/more.help";
import { content as notifier } from "../src/routes/notifier.help";
import { content as seed } from "../src/routes/seed.help";
import { content as signin } from "../src/routes/signin.help";
import { content as transactions } from "../src/routes/transactions.help";

fs.writeFileSync("docs/accounts.md", accounts);
fs.writeFileSync("docs/login.md", login);
fs.writeFileSync("docs/messages.md", messages);
fs.writeFileSync("docs/more.md", more);
fs.writeFileSync("docs/notifier.md", notifier);
fs.writeFileSync("docs/seed.md", seed);
fs.writeFileSync("docs/signin.md", signin);
fs.writeFileSync("docs/transactions.md", transactions);
