const express = require("express"); //external module for using express
const { Client } = require("pg"); //external module for using postgres with node
const config = require("./config.js"); // internal module for connecting to our config file

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client(config); //creating our database Client with our config values

//HELPER FUNCTIONS

const addLanguage = async (
  name,
  releasedYear,
  githutRank,
  pyplRank,
  tiobeRank
) => {
  await client.connect();
  const superego = 2000;
  console.log("this is the id ", superego);
  const createdAt = Date.now();
  const updatedAt = Date.now();
  const result = await client.query(
    `INSERT INTO programming_languages (id, name, released_year, githut_rank, pypl_rank, tiobe_rank, created_at, updated_at) VALUES (${superego}, ${name}, ${releasedYear}, ${githutRank}, ${pyplRank}, ${tiobeRank}, ${createdAt}, ${updatedAt})`
  );
  console.log(result.rows);
  return result.rows;
};

const getLanguages = async () => {
  await client.connect(); //connecting to our database
  const result = await client.query("SELECT * FROM programming_languages"); //effectively saying "hit the play button - do the query"
  console.log(result.rows); //will always have a keycode called "rows" that contains the data
  await client.end(); //ending the connection to our database
  return result.rows;
};

const getLanguage = async (id) => {
  await client.connect(); //connecting to our database
  const result = await client.query(
    `SELECT * FROM programming_languages WHERE id = ${id}`
  );
  console.log(result.rows);
  await client.end(); //ending the connection to our database
  return result.rows;
};

const deleteLanguage = async (num) => {
  await client.connect();
  console.log("this is the id in number format from helper function ", num);
  const result = await client.query(
    `DELETE * FROM programming_languages WHERE id = ${num}`
  );
  await client.end();
};

//ROUTES

app.post("/add-language", async (req, res) => {
  const name = req.body.name;
  const releasedYear = req.body.released_year;
  const githutRank = req.body.githut_rank;
  const pyplRank = req.body.pypl_rank;
  const tiobeRank = req.body.tiobe_rank;
  await addLanguage(name, releasedYear, githutRank, pyplRank, tiobeRank);
  res
    .status(201)
    .json(
      "Congratulations on creating a language! I hope you have at least ten years' experience in it"
    );
});

app.get("/get-languages", async (req, res) => {
  const languages = await getLanguages();
  res.send(languages);
});

app.get("/get-language/:id", async (req, res) => {
  const language = await getLanguage(req.params.id);
  res.send(language);
});

app.delete("/delete-language/:id", async (req, res) => {
  const num = Number(req.params.id);
  console.log("this is the id in number format from api function ", num);
  const languageName = await client.query(
    `SELECT name FROM programming_languages WHERE id = ${num}`
  );
  console.log("the language name is ", languageName);
  const result = await deleteLanguage(num);
  res.status(201).json(`${languageName} is now deleted`);
});

app.listen(port, () => {
  console.log(`doublepi listening at http://localhost:${port}`);
});
