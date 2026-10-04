// Checks the key data in static/keys for mistakes that break the app:
// CSV errors, duplicate ids, links to nothing, questions that link to
// themselves, and questions or species that cannot be reached from start1.
// Exits with status 1 if anything is wrong.
import fs from "node:fs";
import Papa from "papaparse";

const dir = "static/keys/9789050117548";

function read(file) {
    const parsed = Papa.parse(fs.readFileSync(`${dir}/${file}`, "utf8"), {
        header: true,
        skipEmptyLines: true,
    });
    for (const error of parsed.errors) {
        problems.push(`${file} row ${error.row + 2}: ${error.message}`);
    }
    return parsed.data;
}

function duplicates(rows) {
    const seen = new Set();
    return rows.map(x => x.id).filter(id => seen.has(id) || !seen.add(id));
}

const problems = [];
const questions = read("questions.csv");
const mushrooms = read("mushrooms.csv");

for (const id of duplicates(questions)) problems.push(`questions.csv: duplicate id "${id}"`);
for (const id of duplicates(mushrooms)) problems.push(`mushrooms.csv: duplicate id "${id}"`);

const questionById = new Map(questions.map(x => [x.id, x]));
const mushroomIds = new Set(mushrooms.map(x => x.id));

for (const question of questions) {
    for (const field of ["first_link", "second_link"]) {
        const link = question[field];
        if (link === question.id) {
            problems.push(`questions.csv: "${question.id}" ${field} links to itself`);
        } else if (!questionById.has(link) && !mushroomIds.has(link)) {
            problems.push(`questions.csv: "${question.id}" ${field} links to unknown id "${link}"`);
        }
    }
}

const reachable = new Set();
const todo = ["start1"];
while (todo.length > 0) {
    const id = todo.pop();
    if (reachable.has(id)) continue;
    reachable.add(id);
    const question = questionById.get(id);
    if (question) todo.push(question.first_link, question.second_link);
}
for (const id of questionById.keys()) {
    if (!reachable.has(id)) problems.push(`questions.csv: "${id}" cannot be reached from start1`);
}
for (const id of mushroomIds) {
    if (!reachable.has(id)) problems.push(`mushrooms.csv: "${id}" cannot be reached from start1`);
}

if (problems.length > 0) {
    console.error(`Key data has ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
}
console.log(`Key data OK: ${questions.length} questions, ${mushrooms.length} species, all reachable.`);
