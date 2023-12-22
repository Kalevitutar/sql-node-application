const express = require("express"); //external module for using express
const { Client } = require("pg"); //external module for using postgres with node
const config = require("./config.js"); // internal module for connecting to our config file

const app = express();
const port = 3000;
app.use(express.json());
const client = new Client(config); //creating our database Client with our config values

//HELPER FUNCTIONS

const addLanguage = async (
  language,
  releasedYear,
  githutRank,
  pyplRank,
  tiobeRank
) => {
  await client.connect()
  const findMaxId = await client.query('SELECT MAX(id) AS max_id FROM programming_languages'); // To find the largest ID number in current database
  const maxId = findMaxId.rows[0].max_id || 0; // Gets the largest ID number or, if the database is empty, gets zero
  console.log("maxID ", maxId);
  const nextId = maxId + 1;
  console.log("so this new language will have an ID of ", nextId);
  console.log("this is what the helper function thinks the language is ", language);
  const result = await client.query(
    `INSERT INTO programming_languages(id, name, released_year, githut_rank, pypl_rank, tiobe_rank) VALUES (${nextId}, '${language}', ${releasedYear}, ${githutRank}, ${pyplRank}, ${tiobeRank})`
  );
  console.log("result rows are ", result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
};

const getLanguages = async () => {
  await client.connect(); //connecting to our database
  const result = await client.query("SELECT * FROM programming_languages"); //effectively saying "hit the play button - do the query"
  console.log(result.rows); //will always have a keycode called "rows" that contains the data
  await client.end() //ending the connection to our database
  return result.rows;
};

const getLanguage = async (id) => {
  await client.connect(); //connecting to our database
  const result = await client.query(
    `SELECT * FROM programming_languages WHERE id = ${id}`
  );
  console.log(result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
};

const deleteLanguage = async (num) => {
  await client.connect()
  console.log("this is the id in number format from helper function ", num);
   const languageName = await client.query(
    `SELECT name FROM programming_languages WHERE id = ${num}`
  );
  // console.log("the language name is ", languageName);
  const result = await client.query(
    `DELETE FROM programming_languages WHERE id = ${num}`
  );
  console.log("this is the result", result)
  await client.end().then(() => console.log('disconnected')).catch((err) => console.error('connection error', err))
  console.log("THE END")
  return languageName.rows;
}

//ROUTES

app.post("/add-language", async (req, res) => {
  console.log("Tere!");
  const language = req.body.name;
  console.log("this is what it thinks the language is ", language);
  const releasedYear = req.body.released_year;
  const githutRank = req.body.githut_rank;
  const pyplRank = req.body.pypl_rank;
  const tiobeRank = req.body.tiobe_rank;
  const newLanguage = await addLanguage(language, releasedYear, githutRank, pyplRank, tiobeRank);
  res.send(`${newLanguage} has been added`)
  // res
  //   .status(201)
  //   .json(
  //     "Congratulations on creating a language! I hope you have at least ten years' experience in it"
  //   );
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
  const result = await deleteLanguage(num);
  res.status(201).json(`${result[0].name} is now deleted`);
});

app.listen(port, () => {
  console.log(`doublepi listening at http://localhost:${port}`);
});